import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * 错误提示组件
 */
export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="p-4 bg-cba-error/10 border border-cba-error/30 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-cba-error flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-cba-error font-medium">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-xs text-cba-error hover:underline"
            >
              重试
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
