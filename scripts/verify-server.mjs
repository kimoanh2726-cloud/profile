async function verify() {
  const r = await fetch('http://localhost:3000');
  console.log('Page status:', r.status);
  const html = await r.text();
  const cssMatch = html.match(/href="([^"]+layout\.css[^"]*)"/);
  if (!cssMatch) {
    console.error('No CSS found in HTML!');
    return;
  }
  const cssUrl = 'http://localhost:3000' + cssMatch[1];
  console.log('Testing CSS URL:', cssUrl);
  const cssRes = await fetch(cssUrl);
  console.log('CSS status:', cssRes.status);
  const cssText = await cssRes.text();
  console.log('CSS length:', cssText.length, 'bytes');
}
verify().catch(e => console.error(e));
