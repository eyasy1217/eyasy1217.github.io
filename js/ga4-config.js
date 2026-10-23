"// GA4 Configuration and Custom Events
// ================================

// GA4 Measurement ID（各自のIDに変更してください）
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

// GA4初期化
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID, {
  'custom_map': {
    'custom_parameter_1': 'content_type',
    'custom_parameter_2': 'content_id',
    'custom_parameter_3': 'copy_length',
    'custom_parameter_4': 'content_section',
    'custom_parameter_5': 'scroll_depth'
  }
});

// GA4スクリプトを動的に読み込み
(function() {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
})();

// ================================
// カスタムイベント関数群
// ================================

// 1. テキストコピー検知（AI引用把握の核心）
function trackTextCopy() {
  document.addEventListener('copy', function(e) {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length === 0) return;
    
    // どのセクションからコピーされたか特定
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const section = container.closest ? 
      container.closest('[data-section]') || 
      container.closest('h1, h2, h3, .quote-box, .key-point') :
      null;
    
    const sectionName = section ? 
      (section.getAttribute('data-section') || section.tagName.toLowerCase()) : 
      'unknown';
    
    // GA4イベント送信
    gtag('event', 'text_copied', {
      'content_type': 'article',
      'content_id': document.title,
      'copy_length': selectedText.length,
      'content_section': sectionName,
      'page_path': window.location.pathname,
      'copy_timestamp': new Date().toISOString()
    });
    
    // コンソールログ（デバッグ用）
    console.log('[GA4] text_copied:', {
      length: selectedText.length,
      section: sectionName,
      preview: selectedText.substring(0, 50) + '...'
    });
    
    showEventLog('text_copied', {
      length: selectedText.length,
      section: sectionName
    });
  });
}

// 2. スクロール深度トラッキング
function trackScrollDepth() {
  const thresholds = [25, 50, 75, 90];
  const triggered = new Set();
  
  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    
    thresholds.forEach(threshold => {
      if (scrollPercent >= threshold && !triggered.has(threshold)) {
        triggered.add(threshold);
        
        gtag('event', 'scroll_depth', {
          'scroll_depth': threshold,
          'page_path': window.location.pathname,
          'page_title': document.title
        });
        
        console.log('[GA4] scroll_depth:', threshold + '%');
        showEventLog('scroll_depth', { depth: threshold + '%' });
      }
    });
  });
}

// 3. コンテンツ共有トラッキング
function trackShare(platform) {
  gtag('event', 'share', {
    'method': platform,
    'content_type': 'article',
    'content_id': document.title,
    'page_path': window.location.pathname
  });
  
  console.log('[GA4] share:', platform);
  showEventLog('share', { platform: platform });
}

// 4. ファイルダウンロードトラッキング
function trackDownload(fileName, fileType) {
  gtag('event', 'file_download', {
    'file_name': fileName,
    'file_extension': fileType,
    'page_path': window.location.pathname
  });
  
  console.log('[GA4] file_download:', fileName);
  showEventLog('file_download', { file: fileName });
}

// 5. CTAボタンクリック
function trackCTA(buttonName, buttonLocation) {
  gtag('event', 'cta_click', {
    'button_name': buttonName,
    'button_location': buttonLocation,
    'page_path': window.location.pathname
  });
  
  console.log('[GA4] cta_click:', buttonName);
  showEventLog('cta_click', { button: buttonName, location: buttonLocation });
}

// 6. セクション閲覧時間
function trackSectionEngagement() {
  const sections = document.querySelectorAll('[data-track="section"]');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };
  
  const sectionTimers = new Map();
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const sectionId = entry.target.getAttribute('data-section-id');
      
      if (entry.isIntersecting) {
        sectionTimers.set(sectionId, Date.now());
      } else {
        const startTime = sectionTimers.get(sectionId);
        if (startTime) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          
          gtag('event', 'section_engagement', {
            'section_id': sectionId,
            'engagement_time': duration,
            'page_path': window.location.pathname
          });
          
          console.log('[GA4] section_engagement:', sectionId, duration + 's');
          showEventLog('section_engagement', { 
            section: sectionId, 
            time: duration + 's' 
          });
          
          sectionTimers.delete(sectionId);
        }
      }
    });
  }, observerOptions);
  
  sections.forEach(section => observer.observe(section));
}

// 7. 外部リンク離脱
function trackOutboundLinks() {
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="http"]');
    if (!link) return;
    
    const url = new URL(link.href);
    if (url.hostname === window.location.hostname) return;
    
    gtag('event', 'outbound_click', {
      'outbound_url': link.href,
      'outbound_domain': url.hostname,
      'page_path': window.location.pathname
    });
    
    console.log('[GA4] outbound_click:', url.hostname);
    showEventLog('outbound_click', { domain: url.hostname });
  });
}

// 8. フォーム送信（リード生成）
function trackFormSubmit(formName) {
  gtag('event', 'generate_lead', {
    'form_name': formName,
    'page_path': window.location.pathname
  });
  
  console.log('[GA4] generate_lead:', formName);
  showEventLog('generate_lead', { form: formName });
}

// 9. 購入イベント（デモ用）
function trackPurchase(value, currency = 'JPY', items = []) {
  gtag('event', 'purchase', {
    'transaction_id': 'demo_' + Date.now(),
    'value': value,
    'currency': currency,
    'items': items
  });
  
  console.log('[GA4] purchase:', value, currency);
  showEventLog('purchase', { value: value, currency: currency });
}

// 10. セレクトコンテンツ
function trackSelectContent(contentType, contentId) {
  gtag('event', 'select_content', {
    'content_type': contentType,
    'content_id': contentId,
    'page_path': window.location.pathname
  });
  
  console.log('[GA4] select_content:', contentType, contentId);
  showEventLog('select_content', { type: contentType, id: contentId });
}

// ================================
// デバッグ・表示機能
// ================================

// イベントログ表示
function showEventLog(eventName, data) {
  const logPanel = document.getElementById('event-log');
  const logContent = document.getElementById('event-log-content');
  
  if (!logPanel || !logContent) return;
  
  logPanel.style.display = 'block';
  
  const timestamp = new Date().toLocaleTimeString();
  const dataStr = Object.entries(data)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');
  
  const entry = document.createElement('div');
  entry.style.cssText = 'padding: 8px; border-bottom: 1px solid #e2e8f0; margin-bottom: 4px;';
  entry.innerHTML = `
    <strong style="color: #667eea;">${eventName}</strong>
    <span style="color: #718096; font-size: 0.8em;"> (${timestamp})</span><br>
    <span style="color: #4a5568;">${dataStr}</span>
  `;
  
  logContent.insertBefore(entry, logContent.firstChild);
  
  // 最新5件のみ表示
  while (logContent.children.length > 5) {
    logContent.removeChild(logContent.lastChild);
  }
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
  console.log('[GA4 Demo] Tracking initialized');
  
  // 基本トラッキングを有効化
  trackTextCopy();
  trackScrollDepth();
  trackSectionEngagement();
  trackOutboundLinks();
});""