function Header({ currentView, userRole, onBackToHome }) {
  try {
    return (
      <header className="fixed top-0 left-0 right-0 bg-[var(--surface-color)] shadow-lg z-50 border-b border-[var(--border-color)]" data-name="header" data-file="components/Header.js">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-bg flex items-center justify-center mr-3">
                <div className="icon-video text-xl text-white"></div>
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">直播小程序</h1>
            </div>

            <div className="flex items-center gap-4">
              {currentView !== 'home' && (
                <button 
                  onClick={onBackToHome}
                  className="btn btn-secondary"
                >
                  <div className="icon-home text-lg mr-2"></div>
                  返回首页
                </button>
              )}
              
              {currentView === 'streaming' && (
                <div className="live-indicator">
                  <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                  正在直播
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}