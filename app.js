document.addEventListener('DOMContentLoaded',function(){
  var header=document.querySelector('.header');
  // Prevent pinch-zoom and double-tap zoom on mobile
  (function(){
    var lastTouchEnd=0;
    document.addEventListener('gesturestart',function(e){ e.preventDefault(); },{passive:false});
    document.addEventListener('gesturechange',function(e){ e.preventDefault(); },{passive:false});
    document.addEventListener('gestureend',function(e){ e.preventDefault(); },{passive:false});
    document.addEventListener('touchend',function(e){ var now=Date.now(); if(now-lastTouchEnd<=300){ e.preventDefault(); } lastTouchEnd=now; },{passive:false});
    document.addEventListener('wheel',function(e){ if(e.ctrlKey){ e.preventDefault(); } },{passive:false});
  })();
  try{
    var navs=performance.getEntriesByType && performance.getEntriesByType('navigation');
    var isReload = navs && navs.length && navs[0].type === 'reload';
    if(isReload){
      var html=document.documentElement;
      var prev=html.style.scrollBehavior;
      html.style.scrollBehavior='auto';
      window.scrollTo({top:0,left:0,behavior:'auto'});
      setTimeout(function(){ html.style.scrollBehavior=prev||''; },0);
    }
  }catch(e){}
  var onScroll=function(){
    if(!header) return;
    if(window.scrollY>4){header.classList.add('scrolled')}else{header.classList.remove('scrolled')}
  };
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();
  var lang = localStorage.getItem('pf_lang') || 'id';
  function applyLang(){
    var dicts={
      id:{nav_home:'Beranda',nav_about:'Tentang Kami',nav_testi:'Testimoni',nav_bmi:'Tes BMI',nav_login:'Login',extras_more:'Lainnya',extras_contact:'Contact Us',extras_social:'Sosial Media',login_title:'Login',bmi_title:'Tes BMI',member_title:'Formulir Pendaftaran',member_name:'Nama',member_gender:'Jenis Kelamin',member_birthplace:'Tempat Lahir',member_birthdate:'Tanggal Lahir',member_religion:'Agama',member_job:'Pekerjaan',member_address:'Alamat di Jogja',member_wa:'Nomor WhatsApp',member_email:'Email',member_branch:'Cabang',member_package:'Pilih Paket',member_submit:'Kirim'},
      en:{nav_home:'Home',nav_about:'About',nav_testi:'Testimonials',nav_bmi:'BMI Test',nav_login:'Login',extras_more:'More',extras_contact:'Contact Us',extras_social:'Social Media',login_title:'Login',bmi_title:'BMI Test',member_title:'Registration Form',member_name:'Name',member_gender:'Gender',member_birthplace:'Birthplace',member_birthdate:'Birthdate',member_religion:'Religion',member_job:'Occupation',member_address:'Address in Jogja',member_wa:'WhatsApp Number',member_email:'Email',member_branch:'Branch',member_package:'Choose Package',member_submit:'Send',about_title:'Our Vision & Mission',about_p1:'To become a premium fitness center that inspires and nurtures a strong community in health and wellness through foundational fitness education. We aim to be a fitness center equipped with comprehensive facilities, a comfortable atmosphere, and the ability to cater to all segments of society.',about_commit:'Our Commitment',about_p2:'We are dedicated to educating and empowering our members by providing foundational fitness education, ensuring they achieve their fitness goals while understanding the importance of long-term health and wellness. Our commitment extends to making fitness and health accessible to all segments of society, particularly in tier 3 areas, by removing economic barriers. We continuously strive for quality and innovation by updating and enhancing our facilities and services, integrating the latest technology and fitness trends to offer the best experience.',about_p3:'We aim to build a strong, supportive community where every member feels valued and connected, fostering a sense of belonging within the PF Gym & Fitness family. Additionally, we prioritize the well-being and safety of our members in all aspects of our services, while committing to sustainable and environmentally friendly operations.',testi_title:'PF Gym Testimonials',back:'Back'}
    };
    var map=dicts[lang];
    if(!map) return;
    document.querySelectorAll('[data-i18n]').forEach(function(el){ var k=el.getAttribute('data-i18n'); if(map[k]) el.textContent=map[k]; });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){ var k=el.getAttribute('data-i18n-placeholder'); if(map[k]) el.setAttribute('placeholder', map[k]); });
    document.querySelectorAll('.lang-switch a').forEach(function(a){ a.classList.toggle('active', a.getAttribute('data-lang')===lang); });
  }
  applyLang();
  document.querySelectorAll('.lang-switch a').forEach(function(a){ a.addEventListener('click', function(e){ var href=a.getAttribute('href')||'#'; if(href==='#'){ e.preventDefault(); lang=a.getAttribute('data-lang'); localStorage.setItem('pf_lang', lang); applyLang(); } /* else allow navigation to language-specific page */ }); });
  var heroBg=document.querySelector('.hero-bg');
  if(heroBg){
    var baseLayers=[
      'linear-gradient(180deg,rgba(10,15,31,.55),rgba(10,15,31,.75))',
      'radial-gradient(900px 500px at 20% 20%, rgba(0,216,255,.14), transparent)',
      'radial-gradient(900px 500px at 80% 15%, rgba(255,43,215,.16), transparent)'
    ];
    var mql = window.matchMedia && window.matchMedia('(max-width:640px)');
    var updateHero=function(){
      var isMobile = mql ? mql.matches : false;
      var candidates = isMobile ? ['herosection.png?v=1','hero_03_16x9.jpg?v=1'] : ['hero_03_16x9.jpg?v=1'];
      var imgs=[]; var loaded=[];
      candidates.forEach(function(src){ var im=new Image(); im.onload=function(){loaded.push(src)}; im.onerror=function(){}; im.src=src; imgs.push(im); });
      var heroPosY = isMobile ? 45 : 0;
      var applySrc=function(src){
        heroBg.style.backgroundImage = baseLayers.join(',')+", url('"+src+"')";
        heroBg.style.backgroundSize = 'cover';
        heroBg.style.backgroundPosition = 'center '+heroPosY+'%';
        setupHeroProbe(src, 'center '+heroPosY+'%');
        scheduleAnalyze();
      };
      setTimeout(function(){
        var pool = loaded.length ? loaded : candidates;
        applySrc(pool[0]);
      },120);
      if(window.__heroRotateTimer){ clearInterval(window.__heroRotateTimer); window.__heroRotateTimer=null; }
    };
    updateHero();
    if(mql && mql.addEventListener){ mql.addEventListener('change', updateHero); }
  }

  function setupHeroProbe(src, objPos){
    var hero=document.querySelector('.hero');
    if(!hero) return;
    var probe=hero.querySelector('#heroProbe');
    if(!probe){
      probe=document.createElement('img');
      probe.id='heroProbe';
      probe.className='hero-probe';
      hero.appendChild(probe);
    }
    probe.src=src;
    probe.style.objectPosition=objPos;
    var overlay=hero.querySelector('.hero-overlay');
    if(!overlay){ overlay=document.createElement('div'); overlay.className='hero-overlay'; hero.appendChild(overlay); }
  }

  var analyzeTimer=null;
  function scheduleAnalyze(){
    clearTimeout(analyzeTimer);
    analyzeTimer=setTimeout(analyzeHeroCrop,180);
  }

  async function analyzeHeroCrop(){
    var hero=document.querySelector('.hero');
    var probe=document.querySelector('#heroProbe');
    var overlay=hero && hero.querySelector('.hero-overlay');
    if(!hero||!probe||!overlay) return;
    overlay.innerHTML='';
    var nav=document.querySelector('.header');
    var navH=nav?nav.offsetHeight:0;
    var FaceDetectorAvailable = typeof FaceDetector!=='undefined';
    if(!FaceDetectorAvailable){ return; }
    try{
      var fd=new FaceDetector({fastMode:true, maxDetectedFaces:8});
      var faces=await fd.detect(probe);
      var risk=false; var minY=Infinity;
      faces.forEach(function(f){
        var box=document.createElement('div');
        box.className='crop-box';
        // f.boundingBox relative to image element in CSS pixels
        var r=f.boundingBox; // {x,y,width,height}
        box.style.left=r.x+'px';
        box.style.top=r.y+'px';
        box.style.width=r.width+'px';
        box.style.height=r.height+'px';
        overlay.appendChild(box);
        minY=Math.min(minY, r.y);
        if(r.y < navH+8){ risk=true; }
      });
      if(risk){
        var badge=document.createElement('div');
        badge.className='crop-badge';
        badge.textContent='Crop risk: kepala terpotong';
        overlay.appendChild(badge);
        console.warn('Hero crop risk: face near top, consider adjusting background-position');
        // auto adjust downwards up to 68%
        var heroBg=document.querySelector('.hero-bg');
        var current = (heroBg.style.backgroundPosition||'center 35%').split(' ')[1]||'35%';
        var val = parseFloat(current);
        if(!isNaN(val) && val > 2){
          val = Math.max(2, val - 4);
          heroBg.style.backgroundPosition = 'center '+val+'%';
          probe.style.objectPosition = 'center '+val+'%';
          scheduleAnalyze();
        }
      }
    }catch(e){ /* ignore */ }
  }

  window.addEventListener('resize', scheduleAnalyze);

  try{
    if(location.hash==='#testi' || location.hash==='#testi2'){
      var html=document.documentElement;
      var prev=html.style.scrollBehavior;
      html.style.scrollBehavior='auto';
      var target=document.getElementById(location.hash.substring(1));
      if(target) target.scrollIntoView({block:'start'});
      setTimeout(function(){ html.style.scrollBehavior=prev||''; },0);
    }
  }catch(e){}

  var testiTracks=document.querySelectorAll('.testi-track');
  if(testiTracks.length){
    testiTracks.forEach(function(track){
      var inner=track.querySelector('.testi-inner');
      if(!inner) return;
      var children=Array.prototype.slice.call(inner.children);
      children.forEach(function(n){ inner.appendChild(n.cloneNode(true)); });
      children.forEach(function(n){ inner.appendChild(n.cloneNode(true)); });
      var pos=0; var gap=16; var dir=-1; var speedPx=32; var prev=performance.now();
      var dragging=false; var startX=0; var lastX=0; var moved=0; var lastTarget=null;
      var normalize=function(){
        var first=inner.children[0];
        var last=inner.children[inner.children.length-1];
        if(first){ var w=first.offsetWidth+gap; if(-pos>w){ pos+=w; inner.appendChild(first); } }
        if(last){ var wl=last.offsetWidth+gap; if(pos>0){ pos-=wl; inner.insertBefore(last, inner.firstChild); } }
      };
      var step=function(ts){
        var dt=(ts-prev)/1000; prev=ts;
        if(!dragging){ pos+=dir*speedPx*dt; }
        inner.style.transform='translate3d('+pos+'px,0,0)';
        normalize();
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      track.addEventListener('pointerdown',function(e){ dragging=true; startX=e.clientX; lastX=e.clientX; moved=0; lastTarget=e.target; track.classList.add('dragging'); try{track.setPointerCapture(e.pointerId);}catch(_){/* noop */} e.preventDefault(); });
      track.addEventListener('pointermove',function(e){ if(!dragging) return; var dx=e.clientX-lastX; lastX=e.clientX; moved+=Math.abs(dx); lastTarget=e.target; pos+=dx; inner.style.transform='translate3d('+pos+'px,0,0)'; normalize(); });
      var endDrag=function(e){ if(!dragging) return; dragging=false; track.classList.remove('dragging'); if(moved<6){ var anchor=(lastTarget && lastTarget.closest('a.testi-card')) || track.querySelector('a.testi-card:hover'); if(anchor){ window.location.href=anchor.href; } } };
      track.addEventListener('pointerup',endDrag); track.addEventListener('pointercancel',endDrag); track.addEventListener('pointerleave',endDrag);
      track.addEventListener('dragstart',function(e){ e.preventDefault(); });
      // disable native image drag inside
      track.querySelectorAll('img').forEach(function(im){ try{im.setAttribute('draggable','false');}catch(_){}});
      // wheel support on desktop
      track.addEventListener('wheel',function(e){ e.preventDefault(); var d = (Math.abs(e.deltaX)>Math.abs(e.deltaY)) ? e.deltaX : e.deltaY; pos -= d*0.6; inner.style.transform='translate3d('+pos+'px,0,0)'; normalize(); });
      var stepAmount=function(){ var first=inner.children[0]; return first ? (first.offsetWidth+gap) : 320; };
      var btnPrev=track.querySelector('.testi-btn.prev');
      var btnNext=track.querySelector('.testi-btn.next');
      if(btnPrev){ btnPrev.addEventListener('click',function(e){ e.preventDefault(); pos += stepAmount(); inner.style.transform='translate3d('+pos+'px,0,0)'; normalize(); }); }
      if(btnNext){ btnNext.addEventListener('click',function(e){ e.preventDefault(); pos -= stepAmount(); inner.style.transform='translate3d('+pos+'px,0,0)'; normalize(); }); }
    });
  }

  var adminLink=document.getElementById('adminLink');
  if(adminLink){
    adminLink.addEventListener('click',function(e){ /* no prompt here; gate only in admin.html */ });
  }

  var btnAll=document.getElementById('seeAllTestimonials');
  var modal=document.getElementById('testiModal');
  var list=document.getElementById('testiList');
  var tpl=document.getElementById('tmplAllTesti');
  var closeBtn=document.getElementById('closeTesti');
  if(btnAll && modal && list && tpl){
    btnAll.addEventListener('click',function(){
      list.innerHTML='';
      var frag=tpl.content.cloneNode(true);
      frag.querySelectorAll('.testi-card').forEach(function(card){ list.appendChild(card); });
      modal.classList.add('open');
    });
  }
  if(closeBtn && modal){
    closeBtn.addEventListener('click',function(){ modal.classList.remove('open'); });
    modal.addEventListener('click',function(e){ if(e.target===modal){ modal.classList.remove('open'); } });
  }

  document.addEventListener('click',function(e){
    var btn=e.target.closest('.read-more');
    if(!btn) return;
    e.preventDefault();
    var card=btn.closest('.testi-card');
    if(!card||!modal||!list) return;
    var clone=card.cloneNode(true);
    var full=card.querySelector('.full-text');
    if(full){
      var textEl=clone.querySelector('.testi-text');
      if(textEl) textEl.innerHTML=full.innerHTML;
      var rm=clone.querySelector('.read-more'); if(rm) rm.remove();
    }
    list.innerHTML='';
    list.appendChild(clone);
    modal.classList.add('open');
  });

  // Override updateOpenStatus to support 7-day listing, pill status, and manual toggle
  updateOpenStatus = function(){
    var list=document.querySelector('.hours-list');
    if(!list) return;
    try{
      var cfg=window._hoursCfg || (loadHours && loadHours());
      var lang=document.documentElement.lang||'';
      var mapENtoID={'Monday':'Senin','Tuesday':'Selasa','Wednesday':'Rabu','Thursday':'Kamis','Friday':'Jumat','Saturday':'Sabtu','Sunday':'Minggu'};
      list.querySelectorAll('li').forEach(function(li){
        var spans=li.querySelectorAll('span');
        if(spans.length<2) return;
        var rawLabel=spans[0].textContent.trim();
        var label=(lang.toLowerCase()==='en') ? (mapENtoID[rawLabel]||rawLabel) : rawLabel;
        var indicator=spans[2];
        if(!indicator){indicator=document.createElement('span');li.appendChild(indicator)}
        var cfgDay = cfg ? cfg[label] : null;
        if(!cfgDay){indicator.textContent='';indicator.classList.remove('open');return}
        if(cfgDay.closed){
          indicator.textContent='';
          indicator.classList.remove('open');
        }else{
          indicator.textContent=(lang.toLowerCase()==='en'?'OPEN':'BUKA');
          indicator.classList.add('open');
        }
      });
    }catch(e){/* no-op */}
  };

  var updateOpenStatusLegacy=function(){
    var list=document.querySelector('.hours-list');
    if(!list) return;
    try{
      var nowJakarta=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Jakarta'}));
      var currentDayLower=nowJakarta.toLocaleDateString('id-ID',{weekday:'long',timeZone:'Asia/Jakarta'}).toLowerCase();
      var nowHM=nowJakarta.getHours()*60+nowJakarta.getMinutes();
      var cfg=loadHours();
      var dayMap={'senin':'Senin','selasa':'Selasa','rabu':'Rabu','kamis':'Kamis','jumat':'Jumat','sabtu':'Sabtu','minggu':'Minggu'};
      list.querySelectorAll('li').forEach(function(li){
        var spans=li.querySelectorAll('span');
        if(spans.length<2) return;
        var label=spans[0].textContent.trim();
        var indicator=spans[2];
        if(!indicator){indicator=document.createElement('span');li.appendChild(indicator)}
        var targetDay = (label==='Senin–Jumat') ? (['senin','selasa','rabu','kamis','jumat'].includes(currentDayLower) ? dayMap[currentDayLower] : null) : label;
        if(!targetDay){indicator.textContent='';indicator.classList.remove('open');return}
        var cfgDay = cfg ? cfg[targetDay] : null;
        if(cfgDay && cfgDay.closed){indicator.textContent='TUTUP';indicator.classList.remove('open');return}
        var openStr = cfgDay ? cfgDay.open : null;
        var closeStr = cfgDay ? cfgDay.close : null;
        var parseHM=function(s){var hm=s.trim().split(':');return (parseInt(hm[0],10)||0)*60+(parseInt(hm[1],10)||0)};
        var openHM=openStr?parseHM(openStr):parseHM('06:00');
        var closeHM=closeStr?parseHM(closeStr):parseHM('21:00');
        var lang=document.documentElement.lang||'';
        if(nowHM>=openHM && nowHM<closeHM){
          indicator.textContent=(lang.toLowerCase()==='en'?'OPEN':'BUKA');
          indicator.classList.add('open');
        }else{
          indicator.textContent=(lang.toLowerCase()==='en'?'CLOSED':'TUTUP');
          indicator.classList.remove('open');
        }
      });
    }catch(e){/* no-op */}
  };
  updateOpenStatus();
  setInterval(updateOpenStatus,60000);
  var form=document.getElementById('memberForm');
  if(form){
    var pekerjaanSelect=document.getElementById('pekerjaan');
    var pekerjaanLainRow=document.getElementById('pekerjaanLainRow');
    var pekerjaanLainInput=document.getElementById('pekerjaanLain');
    if(pekerjaanSelect){ pekerjaanSelect.addEventListener('change', function(){ pekerjaanLainRow.style.display = (this.value==='Lainnya') ? 'block' : 'none'; }); }
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var submitBtn=document.getElementById('memberSubmit');
      var errBox=document.getElementById('formErrors');
      var showErr=function(msg){ if(errBox){ errBox.style.display='block'; errBox.textContent=msg; } };
      var clearErr=function(){ if(errBox){ errBox.style.display='none'; errBox.textContent=''; } };
      var nama=document.getElementById('nama').value.trim();
      var jk=document.getElementById('jk').value;
      var tempat=document.getElementById('tempatLahir').value.trim();
      var tgl=document.getElementById('tglLahir').value;
      var agama=document.getElementById('agama').value;
      var pekerjaanSel=document.getElementById('pekerjaan').value;
      var pekerjaan=(pekerjaanSel==='Lainnya') ? (pekerjaanLainInput?.value.trim()||'Lainnya') : pekerjaanSel;
      var alamat=document.getElementById('alamat').value.trim();
      var wa=document.getElementById('wa').value.trim();
      var email=document.getElementById('email').value.trim();
      var lokasi=document.getElementById('lokasi').value;
      var paket=document.getElementById('paket').value;
      // basic validations
      var waRe=/^(?:\+?62|0)8[1-9][0-9]{7,10}$/;
      if(!nama) return showErr('Nama wajib diisi');
      if(!jk) return showErr('Jenis kelamin wajib dipilih');
      if(!tempat) return showErr('Tempat lahir wajib diisi');
      if(!tgl) return showErr('Tanggal lahir wajib diisi');
      if(!agama) return showErr('Agama wajib dipilih');
      if(!pekerjaan) return showErr('Pekerjaan wajib diisi');
      if(!alamat) return showErr('Alamat Jogja wajib diisi');
      if(!waRe.test(wa)) return showErr('Nomor WhatsApp tidak valid (gunakan 08xxxxxxxxxx atau +628...)');
      if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showErr('Format email tidak valid');
      if(!lokasi) return showErr('Cabang wajib dipilih');
      if(!paket) return showErr('Paket wajib dipilih');
      clearErr();
      if(submitBtn){ submitBtn.classList.add('loading'); submitBtn.textContent='Mengirim...'; }
      var msg='Halo PF Gym, saya ingin daftar member.'+
        '%0ANama: '+encodeURIComponent(nama)+
        '%0AJenis Kelamin: '+encodeURIComponent(jk)+
        '%0ATempat/Tgl Lahir: '+encodeURIComponent(tempat)+' - '+encodeURIComponent(tgl)+
        '%0AAgama: '+encodeURIComponent(agama)+
        '%0APekerjaan: '+encodeURIComponent(pekerjaan)+
        '%0AAlamat Jogja: '+encodeURIComponent(alamat)+
        '%0AWhatsApp: '+encodeURIComponent(wa)+
        '%0AEmail: '+encodeURIComponent(email)+
        '%0ACabang: '+encodeURIComponent(lokasi)+
        '%0APaket: '+encodeURIComponent(paket);
      var url='https://wa.me/62895392062783?text='+msg;
      window.open(url,'_blank','noopener');
      setTimeout(function(){ if(submitBtn){ submitBtn.classList.remove('loading'); submitBtn.textContent='Kirim'; } }, 1200);
    });
  }

  var bmiForm=document.getElementById('bmiForm');
  if(bmiForm){
    bmiForm.addEventListener('submit',function(e){
      e.preventDefault();
      var gender=document.querySelector('input[name="gender"]:checked')?.value||'Pria';
      var usia=parseInt(document.getElementById('usia').value,10)||null;
      var berat=parseFloat(document.getElementById('berat').value);
      var tinggiCm=parseFloat(document.getElementById('tinggi').value);
      if(!berat||!tinggiCm){return}
      var tinggiM=tinggiCm/100;
      var bmi=berat/(tinggiM*tinggiM);
      var cat,cls,adv;
      if(bmi<18.5){cat='Kurus';cls='yellow';adv='Naikkan asupan kalori dan latihan kekuatan.'}
      else if(bmi<25){cat='Normal';cls='green';adv='Pertahankan pola makan seimbang dan rutin olahraga.'}
      else if(bmi<30){cat='Gemuk';cls='orange';adv='Kurangi kalori dan tingkatkan aktivitas aerobik.'}
      else {cat='Obesitas';cls='red';adv='Konsultasi dengan profesional kesehatan dan rencana penurunan berat badan.'}
      var idealMin=18.5*tinggiM*tinggiM;
      var idealMax=24.9*tinggiM*tinggiM;
      var valBox=document.getElementById('bmiValue');
      var catBox=document.getElementById('bmiCategory');
      var pointer=document.getElementById('bmiPointer');
      var box=document.getElementById('bmiResultBox');
      if(valBox) valBox.textContent='BMI: '+bmi.toFixed(1);
      if(catBox){catBox.innerHTML='<span class="bmi-badge '+cls+'"><i class="bi bi-activity"></i> '+cat+' • '+gender+(usia?(' • '+usia+' th'):'')+' </span>';}
      // saran dihilangkan sesuai permintaan
      if(pointer){
        var min=15,max=35;var pct=(Math.min(Math.max(bmi,min),max)-min)/(max-min);pointer.style.left=(pct*100)+'%';
      }
      if(box) box.style.display='grid';
    });
  }
});
  var tabs=document.querySelectorAll('.pricing-tabs .tab');
  if(tabs.length){
    tabs.forEach(function(btn){
      btn.addEventListener('click',function(){
        tabs.forEach(function(b){b.classList.remove('active');b.setAttribute('aria-selected','false')});
        btn.classList.add('active');btn.setAttribute('aria-selected','true');
        var plan=btn.getAttribute('data-plan');
        document.querySelectorAll('.plan-card').forEach(function(card){card.classList.remove('active')});
        var target=document.getElementById('plan-'+plan);
        if(target) target.classList.add('active');
      });
    });
  }

  
  if(typeof window.updateOpenStatus!=='function'){
    window.updateOpenStatus = function(){
      var list=document.querySelector('.hours-list');
      if(!list) return;
      try{
        var cfg=window._hoursCfg || (loadHours && loadHours());
        var lang=document.documentElement.lang||'';
        var mapENtoID={'Monday':'Senin','Tuesday':'Selasa','Wednesday':'Rabu','Thursday':'Kamis','Friday':'Jumat','Saturday':'Sabtu','Sunday':'Minggu'};
        list.querySelectorAll('li').forEach(function(li){
          var spans=li.querySelectorAll('span');
          if(spans.length<2) return;
          var rawLabel=spans[0].textContent.trim();
          var label=(lang.toLowerCase()==='en') ? (mapENtoID[rawLabel]||rawLabel) : rawLabel;
          var indicator=spans[2];
          if(!indicator){indicator=document.createElement('span');li.appendChild(indicator)}
          var cfgDay = cfg ? cfg[label] : null;
          var openDay=(cfg.openDay||'')+'';
          if(!cfgDay){indicator.textContent='';indicator.classList.remove('open');return}
          if(cfgDay.closed || (openDay && label!==openDay)){indicator.textContent='';indicator.classList.remove('open');}
          else{indicator.textContent=(lang.toLowerCase()==='en'?'OPEN':'BUKA');indicator.classList.add('open');}
        });
      }catch(e){/* no-op */}
    };
  }
  var HOURS_KEY='pf_hours';
  var loadHours=function(){
    try{var raw=localStorage.getItem(HOURS_KEY);return raw?JSON.parse(raw):null}catch(e){return null}
  };
  var applyHoursToIndex=function(){
    var list=document.querySelector('.hours-list');
    if(!list) return;
    var render=function(cfg){
      if(!cfg) return;
      list.querySelectorAll('li').forEach(function(li){
        var spans=li.querySelectorAll('span');
        if(spans.length<2) return;
        var label=spans[0].textContent.trim();
        var key=label;
        var lang=document.documentElement.lang||'';
        if(lang.toLowerCase()==='en'){
          var map={'Monday':'Senin','Tuesday':'Selasa','Wednesday':'Rabu','Thursday':'Kamis','Friday':'Jumat','Saturday':'Sabtu','Sunday':'Minggu'};
          key=map[key]||key;
        }
        var c=cfg[key];
        if(!c) return;
        var isClosed = !!c.closed;
        spans[1].textContent = (c.open||'06:00')+' - '+(c.close||'21:00');
        var indicator=spans[2];
        if(!indicator){indicator=document.createElement('span');li.appendChild(indicator)}
        var openDay=(cfg.openDay||'')+'';
        if(isClosed || (openDay && key!==openDay)){
          indicator.textContent='';indicator.classList.remove('open');
        } else if(!isClosed && (!openDay || key===openDay)){
          indicator.textContent=(lang.toLowerCase()==='en'?'OPEN':'BUKA');indicator.classList.add('open');
        }
      });
    };
    try{
      var cached=loadHours();
      var source=localStorage.getItem('pf_hours_source')||'';
      if(cached){
        window._hoursCfg=cached; render(cached); updateOpenStatus();
        if(!source){ try{ localStorage.setItem('pf_hours_source','local'); }catch(_){} source='local'; }
      }
      if(source==='local'){
        // honor local edits, skip cloud/JSON override
        return;
      }
      if(window.firebaseUtil && window.firebaseUtil.enabled){
        window.firebaseUtil.loadHours().then(function(d){ window._hoursCfg=d; try{ localStorage.setItem('pf_hours', JSON.stringify(d||{})); localStorage.setItem('pf_hours_source','cloud'); }catch(_){} render(d); updateOpenStatus(); }).catch(function(){ /* keep cached */ });
      } else {
        fetch('hours.json?v='+Date.now(),{cache:'no-store'})
          .then(function(r){return r.json()})
          .then(function(d){ window._hoursCfg=d; try{ localStorage.setItem('pf_hours', JSON.stringify(d||{})); localStorage.setItem('pf_hours_source','json'); }catch(_){} render(d); updateOpenStatus(); })
          .catch(function(){ /* keep cached */ });
      }
    }catch(e){ var cfg=loadHours(); window._hoursCfg=cfg; render(cfg); updateOpenStatus(); }
  };
  applyHoursToIndex();
  try{ window.addEventListener('storage',function(e){ if(e && e.key==='pf_hours'){ try{ var cfg=JSON.parse(e.newValue||'{}'); window._hoursCfg=cfg; var list=document.querySelector('.hours-list'); if(list) { var render=function(cfg){ list.querySelectorAll('li').forEach(function(li){ var spans=li.querySelectorAll('span'); if(spans.length<2) return; var label=spans[0].textContent.trim(); var lang=document.documentElement.lang||''; var key=(lang.toLowerCase()==='en'?({'Monday':'Senin','Tuesday':'Selasa','Wednesday':'Rabu','Thursday':'Kamis','Friday':'Jumat','Saturday':'Sabtu','Sunday':'Minggu'})[label]||label:label); var c=cfg[key]; if(!c) return; spans[1].textContent=(c.open||'06:00')+' - '+(c.close||'21:00'); var indicator=spans[2]; if(!indicator){indicator=document.createElement('span');li.appendChild(indicator)} if(c.closed){indicator.textContent='';indicator.classList.remove('open');} else {indicator.textContent=(lang.toLowerCase()==='en'?'OPEN':'BUKA');indicator.classList.add('open');} }); }; render(cfg); updateOpenStatus(); } }catch(_){ } } }); }catch(_){ }

  
  var adminForm=document.getElementById('hoursAdminForm');
  if(adminForm){
    var defaultCfg={
      'Senin':{open:'06:00',close:'21:00',closed:true},
      'Selasa':{open:'06:00',close:'21:00',closed:true},
      'Rabu':{open:'06:00',close:'21:00',closed:true},
      'Kamis':{open:'06:00',close:'21:00',closed:true},
      'Jumat':{open:'06:00',close:'21:00',closed:true},
      'Sabtu':{open:'06:00',close:'21:00',closed:true},
      'Minggu':{open:'08:00',close:'21:00',closed:true},
    };
    var setVal=function(id,val){var el=document.getElementById(id);if(el) el.value=val};
    var setClosed=function(id,val){var el=document.getElementById(id);if(el) el.value=val?'true':'false'};
    var applyAdminCfg=function(cfg){ cfg=cfg||defaultCfg; setVal('seninOpen',cfg['Senin'].open||'06:00');setVal('seninClose',cfg['Senin'].close||'21:00');setClosed('seninClosed',!!(cfg['Senin'].closed));
      setVal('selasaOpen',cfg['Selasa'].open);setVal('selasaClose',cfg['Selasa'].close);setClosed('selasaClosed',cfg['Selasa'].closed);
      setVal('rabuOpen',cfg['Rabu'].open);setVal('rabuClose',cfg['Rabu'].close);setClosed('rabuClosed',cfg['Rabu'].closed);
      setVal('kamisOpen',cfg['Kamis'].open);setVal('kamisClose',cfg['Kamis'].close);setClosed('kamisClosed',cfg['Kamis'].closed);
      setVal('jumatOpen',cfg['Jumat'].open);setVal('jumatClose',cfg['Jumat'].close);setClosed('jumatClosed',cfg['Jumat'].closed);
      setVal('sabtuOpen',cfg['Sabtu'].open);setVal('sabtuClose',cfg['Sabtu'].close);setClosed('sabtuClosed',cfg['Sabtu'].closed);
      setVal('mingguOpen',cfg['Minggu'].open||'08:00');setVal('mingguClose',cfg['Minggu'].close||'21:00');setClosed('mingguClosed',!!(cfg['Minggu'].closed)); };
    // Prefill immediately with defaults to avoid empty inputs
    applyAdminCfg(defaultCfg);
    try{
      if(window.firebaseUtil && window.firebaseUtil.enabled){ window.firebaseUtil.loadHours().then(function(c){ applyAdminCfg(c||loadHours()||defaultCfg); }).catch(function(){ applyAdminCfg(loadHours()||defaultCfg); }); }
      else{ var isPages=(location.host && /github\.io$/.test(location.host)); if(isPages){ fetch('hours.json?v='+Date.now(),{cache:'no-store'}).then(function(r){return r.json()}).then(function(d){ applyAdminCfg(d||loadHours()||defaultCfg); }).catch(function(){ applyAdminCfg(loadHours()||defaultCfg); }); } else { applyAdminCfg(loadHours()||defaultCfg); } }
    }catch(e){ applyAdminCfg(loadHours()||defaultCfg); }

    var readFormCfg=function(){
      var toBool=function(id){return document.getElementById(id).value==='true'};
      return {
        'Senin':{open:document.getElementById('seninOpen').value,close:document.getElementById('seninClose').value,closed:toBool('seninClosed')},
        'Selasa':{open:document.getElementById('selasaOpen').value,close:document.getElementById('selasaClose').value,closed:toBool('selasaClosed')},
        'Rabu':{open:document.getElementById('rabuOpen').value,close:document.getElementById('rabuClose').value,closed:toBool('rabuClosed')},
        'Kamis':{open:document.getElementById('kamisOpen').value,close:document.getElementById('kamisClose').value,closed:toBool('kamisClosed')},
        'Jumat':{open:document.getElementById('jumatOpen').value,close:document.getElementById('jumatClose').value,closed:toBool('jumatClosed')},
        'Sabtu':{open:document.getElementById('sabtuOpen').value,close:document.getElementById('sabtuClose').value,closed:toBool('sabtuClosed')},
        'Minggu':{open:document.getElementById('mingguOpen').value,close:document.getElementById('mingguClose').value,closed:toBool('mingguClosed')},
      };
    };

    var validateOpen=function(cfg){ var cnt=0; Object.keys(cfg).forEach(function(k){ if(!cfg[k].closed) cnt++; }); if(cnt===0){ alert('selamat PFGYM berhasil ditutup'); return true; } if(cnt>1){ alert('eits hari buka maksimal satu'); return false; } return true; };
    

    var loginBtn=document.getElementById('loginBtn');
    var logoutBtn=document.getElementById('logoutBtn');
    var saveCloudBtn=document.getElementById('saveCloudBtn');
    if(loginBtn){ loginBtn.addEventListener('click', function(){ if(!(window.firebaseUtil && window.firebaseUtil.enabled)) return alert('Cloud disabled'); window.firebaseUtil.login().then(function(){ alert('Berhasil login'); }).catch(function(err){ alert('Login gagal: '+(err && (err.code||err)) ); }); }); }
    if(logoutBtn){ logoutBtn.addEventListener('click', function(){ if(!(window.firebaseUtil && window.firebaseUtil.enabled)) return; window.firebaseUtil.logout().then(function(){ alert('Berhasil logout'); }); }); }
    if(saveCloudBtn){ saveCloudBtn.addEventListener('click', function(){
      var cfg=readFormCfg(); if(!validateOpen(cfg)) return;
      try{
        if(window.firebaseUtil && window.firebaseUtil.enabled){
          var u=window.firebaseUtil.user(); if(!u) return alert('Harap login dulu'); if(window.firebaseUtil.isOwner && !window.firebaseUtil.isOwner()) return alert('Akun tidak memiliki akses');
          var openDay=null; Object.keys(cfg).forEach(function(k){ if(!cfg[k].closed) openDay=k; }); cfg.openDay=openDay;
          window.firebaseUtil.saveHours(cfg).then(function(){ try{ localStorage.setItem('pf_hours', JSON.stringify(cfg)); localStorage.setItem('pf_hours_source','local'); }catch(_){} alert('jam berhasil disimpan'); }).catch(function(){ try{ localStorage.setItem('pf_hours', JSON.stringify(cfg)); localStorage.setItem('pf_hours_source','local'); alert('jam disimpan (lokal)'); }catch(_){ alert('Gagal simpan'); } });
        } else {
          var openDay=null; Object.keys(cfg).forEach(function(k){ if(!cfg[k].closed) openDay=k; }); cfg.openDay=openDay;
          try{ localStorage.setItem('pf_hours', JSON.stringify(cfg)); localStorage.setItem('pf_hours_source','local'); alert('jam disimpan (lokal)'); }catch(_){ alert('Cloud disabled'); }
        }
      }catch(e){ try{ localStorage.setItem('pf_hours', JSON.stringify(cfg)); alert('jam disimpan (lokal)'); }catch(_){ alert('Gagal simpan'); } }
    }); }

    var authStatus=document.getElementById('authStatus');
    var renderAuth=function(){ if(!authStatus) return; var u=(window.firebaseUtil && window.firebaseUtil.user)?window.firebaseUtil.user():null; if(u){ authStatus.innerHTML='<div class="bmi-badge green" style="display:inline-flex;align-items:center;gap:8px"><i class="bi bi-check-circle-fill"></i> Login sebagai '+(u.email||'')+'</div>'; } else { authStatus.innerHTML='<div class="bmi-badge yellow" style="display:inline-flex;align-items:center;gap:8px"><i class="bi bi-exclamation-circle"></i> Belum login</div>'; } };
    renderAuth();
    try{ if(window.firebaseUtil && window.firebaseUtil.onAuth){ window.firebaseUtil.onAuth(function(){ renderAuth(); }); } }catch(e){}

    
  }

  
  var menuBtn=document.getElementById('menuBtn');
  var mobileMenu=document.getElementById('mobileMenu');
  var menuOverlay=document.getElementById('menuOverlay');
  if(menuBtn && mobileMenu){
    var toggleMenu=function(e){ if(e){ e.stopPropagation&&e.stopPropagation(); e.preventDefault&&e.preventDefault(); } mobileMenu.classList.toggle('open'); if(menuOverlay){ menuOverlay.classList.toggle('show', mobileMenu.classList.contains('open')); }};
    var ignoreClickUntil=0;
    menuBtn.addEventListener('touchstart',function(e){ ignoreClickUntil=Date.now()+350; toggleMenu(e); },{passive:false});
    menuBtn.addEventListener('click',function(e){ if(Date.now()<ignoreClickUntil) return; toggleMenu(e); });
    document.addEventListener('click',function(e){
      if(!(mobileMenu.classList.contains('open'))) return;
      var t=e.target;
      if(mobileMenu.contains(t) || menuBtn.contains(t)) return;
      mobileMenu.classList.remove('open'); if(menuOverlay){ menuOverlay.classList.remove('show'); }
    });
    mobileMenu.addEventListener('click',function(e){ if(e.target.classList.contains('m-item')) mobileMenu.classList.remove('open'); });
    if(menuOverlay){ menuOverlay.addEventListener('click',function(){ mobileMenu.classList.remove('open'); menuOverlay.classList.remove('show'); }); }
  }
