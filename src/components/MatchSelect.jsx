import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * 比赛选择下拉组件
 */
export function MatchSelect({ matches, selectedMatch, onSelect, loading }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 点击外部关闭下拉框
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (match) => {
    onSelect(match);
    setIsOpen(false);
  };

  // 解析label，将VS用橙色显示并添加间距
  const renderMatchLabel = (label) => {
    if (!label) return '请选择比赛';
    
    // 匹配 "vs" 或 "VS"（不区分大小写）
    const parts = label.split(/(vs|VS)/i);
    
    return parts.map((part, index) => {
      if (/^vs$/i.test(part)) {
        // VS部分用橙色，前后各2px间距
        return (
          <span key={index} className="text-cba-orange mx-0.5">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="w-full px-4 py-2 bg-cba-bg/50 backdrop-blur-sm border border-cba-border rounded-lg text-left flex items-center justify-between hover:bg-cba-bg/70 transition-colors disabled:opacity-50"
      >
        <span className="text-sm text-cba-text truncate">
          {selectedMatch ? renderMatchLabel(selectedMatch.label) : '请选择比赛'}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-cba-text-secondary transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-cba-bg backdrop-blur-lg border border-cba-border rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
          {matches.length === 0 ? (
            <div className="px-4 py-3 text-sm text-cba-text-secondary text-center">
              {loading ? '加载中...' : '暂无比赛'}
            </div>
          ) : (
            matches.map((match) => (
              <button
                key={match.id}
                onClick={() => handleSelect(match)}
                className="w-full px-4 py-2 text-left hover:bg-cba-orange/20 transition-colors border-b border-cba-border last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cba-text truncate">
                    {renderMatchLabel(match.label)}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
