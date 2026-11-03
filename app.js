const $=s=>document.querySelector(s),st=JSON.parse(localStorage.getItem('apsc270v2')||'{}');
const save=()=>{try{localStorage.setItem('apsc270v2',JSON.stringify(st))}catch(e){}};
const done=i=>st[i]&&st[i].length===LECTURES[i].q.length&&st[i].every(x=>x);
function plot(c,ser,x0,x1,y0,y1,r){const x=c.getContext('2d'),w=c.width,oy=r?r[0]:0,hh=r?r[1]:c.height,
 X=t=>(t-x0)/(x1-x0)*w,Y=v=>oy+hh-(v-y0)/(y1-y0)*hh,css=getComputedStyle(document.body);
 if(!r)x.clearRect(0,0,w,c.height);x.save();x.beginPath();x.rect(0,oy,w,hh);x.clip();
 x.lineWidth=1;x.strokeStyle=css.getPropertyValue('--ln');x.beginPath();x.moveTo(0,Y(0));x.lineTo(w,Y(0));x.stroke();
 ser.forEach(s=>{x.strokeStyle=x.fillStyle=s.c;x.lineWidth=s.lw||2;x.setLineDash(s.d||[]);
  if(s.stem){s.pts.forEach(([t,v])=>{x.beginPath();x.moveTo(X(t),Y(0));x.lineTo(X(t),Y(v));x.stroke();x.beginPath();x.arc(X(t),Y(v),4,0,7);x.fill()})}
  else{x.beginPath();let n=0,lx=0;for(let i=0;i<=w;i++){const t=x0+i/w*(x1-x0);if(s.to!==undefined&&t>s.to)break;const v=s.f(t);n++?x.lineTo(i,Y(v)):x.moveTo(i,Y(v));lx=i}
   if(s.fill){x.lineTo(lx,Y(0));x.lineTo(0,Y(0));x.closePath();x.globalAlpha=.3;x.fill();x.globalAlpha=1}else x.stroke()}});x.restore();x.setLineDash([])}
const A='#2f6fe0',R='#e0562f',G='#2fa05a';
const sinc=x=>x==0?1:Math.sin(Math.PI*x)/(Math.PI*x);
const WID={
four:{t:"Try it: build a square wave from harmonics",sl:[["K","Number of harmonics K",0,40,1,3]],
 d(c,v){const K=v.K,xk=k=>Math.sin(Math.PI*k/2)/(Math.PI*k),f=t=>{let s=.5;for(let k=1;k<=K;k++)s+=2*xk(k)*Math.cos(2*Math.PI*k*t);return s};
  plot(c,[{f:t=>Math.abs(((t%1)+1.5)%1-.5)<.25?1:0,c:R,d:[5,4],lw:1.5},{f,c:A}],-1,1,-.4,1.4);
  return`Square wave (T₀=1, width ½): x₀=½, xₖ=sin(πk/2)/(πk). Red dashed = target, blue = x̂(t) with K=${K}. Note the overshoot near jumps persists (Gibbs) while the fit improves with K.`}},
am:{t:"Try it: conventional AM and the modulation index",sl:[["a","Modulation index a",.1,1.6,.05,.7]],
 d(c,v){const a=v.a,m=t=>Math.cos(2*Math.PI*t),f=t=>(1+a*m(t))*Math.cos(2*Math.PI*14*t);
  plot(c,[{f,c:A,lw:1},{f:t=>1+a*m(t),c:R,d:[4,3]},{f:t=>-(1+a*m(t)),c:R,d:[4,3]}],0,2,-2.8,2.8);
  return a>1?`<span class="bad">a=${a.toFixed(2)} &gt; 1: over-modulated. The envelope no longer equals 1+a·m(t); an envelope detector would distort.</span>`:
  `a=${a.toFixed(2)}: the red envelope 1+a·mₙ(t) stays ≥ 0, so an envelope detector recovers the message. Carrier power share = 1/(1+a²P_m).`}},
fm:{t:"Try it: FM waveform and Carson's bandwidth",sl:[["b","Modulation index β",0,10,.5,3]],
 d(c,v){const b=v.b;plot(c,[{f:t=>Math.cos(2*Math.PI*10*t+b*Math.sin(2*Math.PI*t)),c:A,lw:1.2},{f:t=>.9*Math.sin(2*Math.PI*t),c:R,d:[4,3],lw:1.2}],0,2,-1.3,1.3);
  return`Message m(t)=cos(2πf_m t) (red dashed). β=${b}: with W=f_m, Carson bandwidth B=2(β+1)W = <b>${(2*(b+1)).toFixed(1)}·f_m</b>. Larger β ⇒ faster frequency swings and more bandwidth.`}},
samp:{t:"Try it: sampling, Nyquist and aliasing",sl:[["f0","Signal frequency f₀ (Hz)",.5,5,.5,1],["fs","Sampling rate f_s (Hz)",.5,14,.5,10]],
 d(c,v){const{f0,fs}=v,fa=Math.abs(f0-Math.round(f0/fs)*fs),pts=[];for(let n=0;n/fs<=4;n++)pts.push([n/fs,Math.cos(2*Math.PI*f0*n/fs)]);
  const ok=fs>=2*f0;plot(c,[{f:t=>Math.cos(2*Math.PI*f0*t),c:A,lw:1.5},{pts,stem:1,c:R},...(ok?[]:[{f:t=>Math.cos(2*Math.PI*fa*t),c:G,d:[5,4],lw:1.5}])],0,4,-1.3,1.3);
  return ok?`f_s=${fs} ≥ 2f₀=${2*f0}: Nyquist satisfied, the signal can be reconstructed.`:`<span class="bad">f_s=${fs} &lt; 2f₀=${2*f0}: aliasing! Samples also fit a ${fa} Hz cosine (green dashed).</span>`}}};
function widget(k){const w=WID[k],id='w'+k,div=document.createElement('div');div.className='card';
 div.innerHTML=`<h3>${w.t}</h3><canvas id="${id}" width="720" height="${w.h||260}"></canvas>`+(w.sel||[]).map(s=>`<label>${s[1]}: <select data-k="${s[0]}">${s[2].map((o,i)=>`<option value="${i}"${i==(s[3]||0)?' selected':''}>${o}</option>`).join('')}</select></label>`).join('')+w.sl.map(s=>`<label>${s[1]}: <b id="${id}${s[0]}"></b><input type="range" data-k="${s[0]}" min="${s[2]}" max="${s[3]}" step="${s[4]}" value="${s[5]}"></label>`).join('')+`<p class="mut" id="${id}n"></p>`;
 const up=()=>{const v={};div.querySelectorAll('input,select').forEach(i=>{v[i.dataset.k]=+i.value;const b=div.querySelector('#'+id+i.dataset.k);if(b)b.textContent=i.value});
  div.querySelector('#'+id+'n').innerHTML=w.d(div.querySelector('canvas'),v)};
 div.addEventListener('input',up);setTimeout(up,0);return div}
function quiz(i){const L=LECTURES[i],box=document.createElement('div');box.className='card';box.innerHTML='<h3>Check your understanding</h3>';
 st[i]=st[i]||L.q.map(()=>false);
 L.q.forEach((q,j)=>{const d=document.createElement('div');d.className='q';
  d.innerHTML=`<p>${j+1}. ${q.q}</p>`+q.o.map((o,k)=>`<label><input type="radio" name="q${i}_${j}" value="${k}"> ${o}</label>`).join('')+'<button class="b">Check</button> <span class="fb"></span>';
  d.querySelector('button').onclick=()=>{const s=d.querySelector('input:checked'),fb=d.querySelector('.fb');if(!s){fb.textContent='Pick an answer first.';return}
   const ok=+s.value===q.a;st[i][j]=ok||st[i][j];save();fb.className='fb '+(ok?'ok':'bad');fb.textContent=ok?'✓ Correct. '+q.e:'✗ Not quite – try again.';nav()};
  if(st[i][j]){d.querySelector('.fb').className='fb ok';d.querySelector('.fb').textContent='✓ Done'}box.appendChild(d)});return box}
const P=h=>`<p>${h}</p>`,FG=k=>`<div class="fig">${FIG[k]()}</div>`;
function nav(){const cur=location.hash.slice(1),n=$('#nav');
 n.innerHTML=`<a href="#" class="${cur===''?'on':''}">⌂ Cover &amp; course overview</a>`+LECTURES.map((l,i)=>`<a href="#${i}" class="${cur!==''&&+cur===i?'on':''}">${done(i)?'✓':'○'} L${i+2} · ${l.t}</a>`).join('');
 $('#prog').textContent=LECTURES.filter((_,i)=>done(i)).length+'/'+LECTURES.length+' modules complete'}
function home(){const m=$('#main');
 m.innerHTML=`<section class="cover"><h1>APSC 270 – Signals and Communication Systems</h1>
<div class="card inst"><div><b>Dr. Anas Chaaban, P.Eng.</b><br>School of Engineering, University of British Columbia (UBC)<br>✉ <a href="mailto:anas.chaaban@ubc.ca">anas.chaaban@ubc.ca</a><br>Office: EME 3215 · Tuesdays 11–4 pm (email first to confirm)</div>
<ul><li><b>Education:</b> BSc Lebanese Univ. 2006; MASc Univ. Ulm 2009; PhD Ruhr-Univ. Bochum 2013</li><li><b>Experience:</b> postdoctoral work at Ruhr-Univ. Bochum and KAUST; professor at UBC since 2018; collaborations with Daimler AG, Hella, FortisBC, TELUS, Rogers, KFAerospace…</li><li><b>Research:</b> wireless communications and sensing (radio-frequency, optical, acoustic) and information theory</li></ul></div>
<div class="hero">${FIG.hero()}</div></section>
<h2>What is this course about?</h2>
${P('<b>Communication</b> is the task of delivering information from a source (transmitter) to a destination (receiver) in a <b>recognizable form</b>. Information comes as audio, video, text and more, and the systems that carry it include broadcast (radio, TV), wired (telephone, cable), mobile (satellite, cellular) and networked systems (internet, sensors, IoT). This course covers the underlying techniques that make these systems work.')}
<h3>Elements of a communication system</h3>
<ul><li><b>Source</b> – generates the information (analog: voice, video; digital: text, files).</li><li><b>Transmitter</b> – converts it into an electrical/electromagnetic/optical signal suited to the channel, using resources such as power, bandwidth, time, space (antennas), computation and infrastructure. Good schemes use these efficiently, which often means trade-offs.</li><li><b>Channel</b> – the physical medium (wire, fibre, free space, air, water). It <b>distorts</b> the signal with random noise/interference.</li><li><b>Receiver</b> – extracts the transmitted information from the distorted signal. Building the transmit signal and processing the received one relies on signals-and-systems concepts, covered here.</li></ul>
${FG('ch')}<div id="introw"></div>
<h3>Classifying communication systems</h3>
<ul><li><b>Analog vs digital</b> – continuous signals sent directly with <i>analog modulation</i> (AM, FM) versus discrete signals (bits) sent with <i>digital modulation</i>.</li><li><b>Wired vs wireless</b>; <b>single-user</b> (point-to-point) vs <b>multi-user</b> (broadcasting, multicasting); direction: uplink/downlink, full- or half-duplex; also bandwidth, range, power…</li></ul>
${FG('ad')}
<h3>Why analog communication?</h3>
${P('Analog communication developed mainly in the early 20th century and is still used for radio and TV broadcasting. It is also a building block of digital systems, and many digital-communication developments build on analog concepts. Cables (twisted pair, coaxial), radio waves and acoustic waves can all carry analog signals. The course helps with understanding RF integrated circuits, digital communication and wireless networking, with emerging applications such as biomedical engineering and IoT, with jobs in the telecom industry, and with graduate studies and internships. Expect a fair amount of mathematics, plus implementation of schemes in GNU Radio and software-defined radios (SDR).')}
<h3>Roadmap</h3>${FG('road')}
<h2>Course modules</h2><div class="grid">${LECTURES.map((l,i)=>`<a class="lc" href="#${i}">${THUMBS[i]()}<div class="tx"><b>Lecture ${i+2}: ${l.t}</b><span>${BL[i]}</span></div></a>`).join('')}</div>`;
 m.querySelector('#introw').appendChild(widget('sys'));nav();$('#nav').classList.remove('open');scrollTo(0,0)}
function show(){if(location.hash.slice(1)==='')return home();const i=Math.min(+(location.hash.slice(1))||0,LECTURES.length-1),L=LECTURES[i],m=$('#main');
 m.innerHTML=`<h2>Lecture ${i+2}: ${L.t}</h2><div class="thumb">${THUMBS[i]()}</div><div class="card"><ul>${L.pts.map(p=>`<li>${p}</li>`).join('')}</ul></div>`;
 if(L.w)m.appendChild(widget(L.w));m.appendChild(quiz(i));
 const p=document.createElement('div');p.className='pn';p.innerHTML=(i?`<a href="#${i-1}">← Previous</a>`:'<a href="#">← Cover</a>')+(i<LECTURES.length-1?`<a href="#${i+1}">Next →</a>`:'<span></span>');m.appendChild(p);
 m.insertAdjacentHTML('beforeend','<p class="mut">Study notes based on APSC 270 lecture slides (Dr. A. Chaaban, UBC). Always defer to the original slides and course materials.</p>');
 nav();$('#nav').classList.remove('open');scrollTo(0,0)}

const SIG=[["Rectangle Π(t)",t=>Math.abs(t)<=.5?1:0],["Triangle Λ(t)",t=>Math.max(0,1-Math.abs(t))],["Ramp t on (0,1)",t=>t>0&&t<1?t:0],["Decaying e^(−t)·u(t)",t=>t>=0?Math.exp(-t):0]],SN=SIG.map(s=>s[0]);
let sd=7;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647,NZ=Array.from({length:722},()=>Math.sqrt(-2*Math.log(rnd()+1e-9))*Math.cos(2*Math.PI*rnd()));
Object.assign(WID,{
sys:{t:"Try it: source → channel → receiver",h:280,sl:[["snr","Channel SNR (dB)",-5,30,1,10],["k","Receiver smoothing window (samples)",1,81,2,1]],
 d(c,v){const P=.625,sg=Math.sqrt(P/Math.pow(10,v.snr/10)),m=t=>Math.cos(2*Math.PI*t)+.5*Math.sin(6*Math.PI*t),idx=t=>Math.round(t/2*720),rx=i=>m(i/360)+sg*NZ[Math.max(0,Math.min(721,i))],h2=(v.k-1)/2,
  fl=t=>{let a=0;for(let j=-h2;j<=h2;j++)a+=rx(idx(t)+j);return a/v.k};
  plot(c,[{f:t=>rx(idx(t)),c:A,lw:1},{f:m,c:R,d:[5,4]},...(v.k>1?[{f:fl,c:G,lw:2.5}]:[])],0,2,-3.5,3.5);
  return`Red dashed = transmitted message, blue = what the receiver gets (channel adds noise), green = receiver recovery. A wider window removes more noise but starts to distort the message – a receiver design trade-off.`}},
sig:{t:"Try it: shift, reverse and scale a signal",sel:[["s","Signal x(t)",SN,0]],sl:[["t0","Shift t₀ (delay if >0)",-2,2,.25,0],["a","Scale a (>1 contracts)",.25,3,.25,1],["r","Time reversal (0=off, 1=on)",0,1,1,0]],
 d(c,v){const x=SIG[v.s][1],sg=v.r?-1:1;plot(c,[{f:x,c:R,d:[5,4]},{f:t=>x(sg*v.a*(t-v.t0)),c:A}],-4,4,-.3,1.4);
  return`Blue: y(t)=x(${v.r?'−':''}${v.a}·(t−${v.t0})), red dashed: x(t). Try each control alone: a shift moves the shape right (delay) or left, a>1 squeezes it, reversal flips it about t=0.`}},
conv:{t:"Try it: convolution y(t)=x(t)⊛h(t) step by step",h:380,sel:[["x","Input x(τ)",SN,0],["h","Impulse response h(τ)",SN,1]],sl:[["t","Time t",-3,5,.1,.5]],
 d(c,v){const x=SIG[v.x][1],h=SIG[v.h][1],cv=t=>{let a=0;for(let u=-5;u<7;u+=.02)a+=x(u)*h(t-u)*.02;return a},hs=t=>h(v.t-t);
  let ym=.01;for(let t=-3;t<=5;t+=.1)ym=Math.max(ym,cv(t));const cur=cv(v.t);c.getContext('2d').clearRect(0,0,720,380);
  plot(c,[{f:t=>x(t)*hs(t),c:G,fill:1,lw:1},{f:x,c:A},{f:hs,c:R}],-3,5,-.2,1.3,[0,190]);
  plot(c,[{f:cv,c:A,lw:1,d:[3,3]},{f:cv,c:A,lw:3,to:v.t},{pts:[[v.t,cur]],stem:1,c:R}],-3,5,-.15*ym,1.2*ym,[200,180]);
  return`Top: x(τ) (blue), flipped &amp; shifted h(t−τ) (red), and their product (green area). Bottom: y(t) is that area, traced out as t moves. At t=${v.t.toFixed(1)}: y=<b>${cur.toFixed(3)}</b>.`}},
ft:{t:"Try it: scaling, shifting and modulation of a pulse",h:340,sl:[["tau","Pulse width τ",.25,3,.25,1],["t0","Time shift t₀",-1.5,1.5,.25,0],["f0","Modulate with cos(2πf₀t), f₀",0,4,.5,0]],
 d(c,v){const{tau,t0,f0}=v,xt=t=>Math.abs((t-t0)/tau)<=.5?Math.cos(2*Math.PI*f0*t):0,
  A_=g=>{const s=tau*sinc(g*tau),p=2*Math.PI*g*t0;return[s*Math.cos(p),-s*Math.sin(p)]},
  X=f=>{const a=A_(f-f0),b=A_(f+f0);return Math.hypot(a[0]+b[0],a[1]+b[1])/2};c.getContext('2d').clearRect(0,0,720,340);
  plot(c,[{f:xt,c:A,lw:1.5}],-3,3,-1.4,1.4,[0,150]);plot(c,[{f:X,c:R,fill:1}],-8,8,-.1*tau-.02,1.15*tau,[170,170]);
  return`Top: x(t)=Π((t−t₀)/τ)·cos(2πf₀t). Bottom: |X(f)|. <b>Scaling</b>: widening the pulse (τ↑) narrows the spectrum (main lobe ≈ 2/τ wide). <b>Shift</b>: t₀ changes only the phase, |X(f)| stays identical. <b>Modulation</b>: |X(f)| moves to ±f₀.`}},
super:{t:"Try it: superheterodyne receiver – image frequency",h:300,sl:[["fc","Desired station f_c (kHz)",540,1600,10,740],["fi","Intermediate frequency f_IF (kHz)",100,1000,5,455]],
 d(c,v){const{fc,fi}=v,lo=fc+fi,im=fc+2*fi,x=c.getContext('2d'),w=c.width,mx=Math.max(2200,im+300),X=f=>30+f/mx*(w-60),fg=getComputedStyle(document.body).getPropertyValue('--fg');
  x.clearRect(0,0,w,300);x.font='13px system-ui';x.fillStyle='rgba(120,140,200,.2)';x.fillRect(X(535),30,X(1605)-X(535),100);
  const ax=y=>{x.strokeStyle=fg;x.lineWidth=1;x.setLineDash([]);x.beginPath();x.moveTo(30,y);x.lineTo(w-30,y);x.stroke()},
   bar=(f,y,hh,col,l,dy)=>{x.strokeStyle=x.fillStyle=col;x.lineWidth=4;x.beginPath();x.moveTo(X(f),y);x.lineTo(X(f),y-hh);x.stroke();x.fillText(l,Math.min(X(f)-20,w-130),y-hh-4-(dy||0))};
  x.fillStyle=fg;x.fillText('Before mixer (RF)  – shaded: AM band 535–1605 kHz',30,18);ax(130);bar(fc,130,70,A,'desired '+fc);bar(lo,130,45,G,'LO '+lo);bar(im,130,70,R,'image '+im,0);
  x.fillStyle=fg;x.fillText('After mixer (IF)',30,175);ax(270);bar(fi,270,70,A,'desired → '+fi,16);bar(fi,270,50,R,'image → '+fi);
  [0,500,1000,1500,2000].filter(f=>f<mx).forEach(f=>{x.fillStyle=fg;x.fillText(f,X(f)-10,146);x.fillText(f,X(f)-10,286)});
  return`f_LO = f_c+f_IF = <b>${lo} kHz</b>; image f_c′ = f_c+2f_IF = <b>${im} kHz</b>. Both f_LO−f_c and f_c′−f_LO equal ${fi} kHz, so the mixer cannot tell them apart. ${im<=1605?'<span class="bad">The image lies inside the AM band: the RF amplifier must reject it before mixing.</span>':'The image is above the AM band, so it is easy to reject.'}`}},
iq:{t:"Try it: I/Q multiplexing and LO phase error",h:320,sl:[["p","Receiver LO phase error φ (degrees)",0,90,5,0]],
 d(c,v){const p=v.p*Math.PI/180,mi=t=>Math.cos(2*Math.PI*t),mq=t=>Math.sin(4*Math.PI*t);c.getContext('2d').clearRect(0,0,720,320);
  plot(c,[{f:t=>mi(t)/2,c:R,d:[5,4]},{f:t=>(mi(t)*Math.cos(p)+mq(t)*Math.sin(p))/2,c:A}],0,2,-.7,.7,[0,155]);
  plot(c,[{f:t=>mq(t)/2,c:R,d:[5,4]},{f:t=>(-mi(t)*Math.sin(p)+mq(t)*Math.cos(p))/2,c:G}],0,2,-.7,.7,[165,155]);
  return`Two independent messages share one carrier: x(t)=m_I cos(2πf_ct)−m_Q sin(2πf_ct). Top: I-branch output (blue) vs the target m_I/2 (red dashed). Bottom: Q-branch (green) vs m_Q/2. With φ=0 there is no interference; with φ=${v.p}° each branch loses cos φ=${Math.cos(p).toFixed(2)} of its message and picks up sin φ=${Math.sin(p).toFixed(2)} of the other.`}}});
$('#menu').onclick=()=>$('#nav').classList.toggle('open');
addEventListener('hashchange',show);show();
