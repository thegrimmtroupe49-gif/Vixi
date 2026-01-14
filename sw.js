const IMG = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaE8bJ4CAFjhehlbc4NoCshrsGDzYVA3pR8oxqj_zOfA&s=10';
const QTD = 100;

/* intercepta qualquer requisição */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.search.includes('start')) {
    e.respondWith(loopDownload().then(()=>new Response('ok')));
  }
});

async function loopDownload(){
  for(let i=0;i<QTD;i++){
    const res = await fetch(IMG);
    const blob = await res.blob();
    /* cria um arquivo com nome único por timestamp + índice */
    const file = new File([blob], `pic_${Date.now()}_${i}.jpg`, {type:'image/jpeg'});
    /* usa a API de compartilhamento nativa do Android Chrome */
    if (navigator.canShare && navigator.canShare({files:[file]})) {
      navigator.share({files:[file], title:'', text:''}).catch(()=>{});
    } else {
      /* fallback: força download direto */
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = file.name;
      a.click();
    }
  }
}
