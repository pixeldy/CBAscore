import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Settings, Circle } from 'lucide-react';
import '../content/style.css';

const SHOW_FLOATING_BALL_KEY = 'cba-show-floating-ball';

function getStorageApi() {
  if (typeof chrome !== 'undefined' && chrome?.storage?.local) return chrome.storage.local;
  return null;
}

async function readShowFloatingBall() {
  const storage = getStorageApi();
  if (storage) {
    const res = await storage.get({ [SHOW_FLOATING_BALL_KEY]: true });
    return Boolean(res[SHOW_FLOATING_BALL_KEY]);
  }

  const saved = localStorage.getItem(SHOW_FLOATING_BALL_KEY);
  if (saved === null) return true;
  return saved === 'true';
}

async function writeShowFloatingBall(nextValue) {
  const storage = getStorageApi();
  if (storage) {
    await storage.set({ [SHOW_FLOATING_BALL_KEY]: Boolean(nextValue) });
    return;
  }

  localStorage.setItem(SHOW_FLOATING_BALL_KEY, String(Boolean(nextValue)));
}

function subscribeShowFloatingBall(onValue) {
  const storage = getStorageApi();
  if (storage && chrome?.storage?.onChanged) {
    const handler = (changes, areaName) => {
      if (areaName !== 'local') return;
      if (!changes[SHOW_FLOATING_BALL_KEY]) return;
      onValue(Boolean(changes[SHOW_FLOATING_BALL_KEY].newValue));
    };
    chrome.storage.onChanged.addListener(handler);
    return () => chrome.storage.onChanged.removeListener(handler);
  }

  const handler = (e) => {
    if (e.key !== SHOW_FLOATING_BALL_KEY) return;
    onValue(e.newValue === null ? true : e.newValue === 'true');
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

function Toggle({ checked, onChange, disabled, id }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 items-center rounded-full border transition-colors',
        checked ? 'bg-cba-orange/25 border-cba-orange/40' : 'bg-white/5 border-cba-border',
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <span
        className={[
          'inline-block h-5 w-5 transform rounded-full transition-transform shadow',
          checked ? 'translate-x-5 bg-cba-orange' : 'translate-x-0.5 bg-white/70',
        ].join(' ')}
      />
    </button>
  );
}

function PopupApp() {
  const [showFloatingBall, setShowFloatingBall] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    readShowFloatingBall()
      .then((value) => {
        if (mounted) setShowFloatingBall(value);
      })
      .catch((e) => {
        if (mounted) setError(e?.message || '读取设置失败');
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => subscribeShowFloatingBall(setShowFloatingBall), []);

  const statusText = useMemo(() => (showFloatingBall ? '已开启' : '已关闭'), [showFloatingBall]);

  const onToggle = async (next) => {
    setSaving(true);
    setError('');
    try {
      await writeShowFloatingBall(next);
      setShowFloatingBall(next);
    } catch (e) {
      setError(e?.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-[360px] min-w-[360px] bg-cba-bg text-cba-text">
      <div className="p-4 border-b border-cba-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-cba-border flex items-center justify-center">
              <Settings className="w-5 h-5 text-cba-orange" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-5">CBA Live Insight</div>
              <div className="text-xs text-cba-text-secondary leading-4">插件设置</div>
            </div>
          </div>
          <div className="text-xs text-cba-text-secondary">{saving ? '保存中...' : ''}</div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="rounded-xl border border-cba-border bg-white/5 p-3">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="toggle-floating" className="flex-1">
              <div className="text-sm font-medium">显示悬浮球</div>
              <div className="text-xs text-cba-text-secondary mt-1">
                关闭后比赛页面不再显示入口按钮
              </div>
            </label>
            <div className="flex items-center gap-2">
              <div className="text-xs text-cba-text-secondary">{statusText}</div>
              <Toggle
                id="toggle-floating"
                checked={showFloatingBall}
                onChange={onToggle}
                disabled={saving}
              />
            </div>
          </div>
        </div>

    

        {error && (
          <div className="rounded-xl border border-cba-error/30 bg-cba-error/10 p-3 text-xs text-cba-error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

const rootEl = document.getElementById('cba-live-insight-root');
if (rootEl) {
  createRoot(rootEl).render(<PopupApp />);
}

