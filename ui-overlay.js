export function renderOverlay(result){
  const panel=document.createElement('div');

  panel.style.position='fixed';
  panel.style.top='120px';
  panel.style.right='20px';
  panel.style.width='280px';
  panel.style.background='#fff';
  panel.style.border='1px solid #ddd';
  panel.style.padding='12px';
  panel.style.zIndex=9999;
  panel.style.fontFamily='Arial';

  const signals=result.signals.map(s=>`<li>${s}</li>`).join('');

  panel.innerHTML=`
  <h3>Candidate Authenticity</h3>
  <strong>Risk Score: ${result.score}/100</strong>
  <ul>${signals}</ul>
  `;

  document.body.appendChild(panel);
}
