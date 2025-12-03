// Firebase integration without secrets. Fill FIREBASE_CONFIG below and set FIREBASE_ENABLED=true.
window.firebaseUtil=(function(){
  var app=null, auth=null, db=null;
  var cfg=window.FIREBASE_CONFIG||{};
  try{ var raw=localStorage.getItem('PF_FIREBASE_CONFIG'); if(!Object.keys(cfg).length && raw){ cfg=JSON.parse(raw) } }catch(e){}
  var flag = !!window.FIREBASE_ENABLED || (localStorage.getItem('PF_FIREBASE_ENABLED')==='true');
  var enabled=false;
  try{
    if(flag && window.firebase && firebase.initializeApp){
      app=firebase.initializeApp(cfg);
      auth=firebase.auth();
      try{ auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); }catch(_){ }
      db=firebase.firestore();
      enabled=true;
    }
  }catch(e){ enabled=false }
  var ownerEmails=(function(){
    var arr=[];
    try{
      if(Array.isArray(window.FIREBASE_OWNER_EMAILS)) arr=window.FIREBASE_OWNER_EMAILS.slice();
      else if(window.FIREBASE_OWNER_EMAIL) arr=[window.FIREBASE_OWNER_EMAIL];
      var raw=localStorage.getItem('PF_FIREBASE_OWNER_EMAILS'); if(raw){ try{ var j=JSON.parse(raw); if(Array.isArray(j)) arr=j; }catch(_){ } }
    }catch(_){ }
    return arr.map(function(e){ return (e||'').toLowerCase(); });
  })();
  var login=function(){
    if(!enabled||!auth) return Promise.reject('disabled');
    var provider=new firebase.auth.GoogleAuthProvider();
    try{ provider.setCustomParameters({prompt:'select_account'}); }catch(_){ }
    var ensureOwner=function(){ var u=auth.currentUser; if(!u || !u.email) return Promise.reject('login_failed'); var e=(u.email||'').toLowerCase(); if(ownerEmails.length && ownerEmails.indexOf(e)===-1){ return auth.signOut().then(function(){ return Promise.reject('not_owner') }); } return Promise.resolve(u); };
    return auth.signInWithPopup(provider)
      .then(ensureOwner)
      .catch(function(){ return auth.signInWithRedirect(provider) });
  };
  var logout=function(){ if(!enabled||!auth) return Promise.resolve(); return auth.signOut() };
  var user=function(){ return auth?auth.currentUser:null };
  var isOwner=function(){ var u=user(); var e=(u&&u.email||'').toLowerCase(); return !!(e && ownerEmails.length && ownerEmails.indexOf(e)!==-1); };
  var onAuth=function(cb){ if(!enabled||!auth) return; auth.onAuthStateChanged(cb) };
  var hoursDoc=function(){ return db.collection('hours').doc('pfgym') };
  var loadHours=function(){ if(!enabled||!db) return Promise.reject('disabled'); return hoursDoc().get().then(function(s){ return s.exists ? s.data() : null }) };
  var saveHours=function(cfg){ if(!enabled||!db) return Promise.reject('disabled'); if(!isOwner()) return Promise.reject('forbidden'); return hoursDoc().set(cfg,{merge:true}) };
  var settingsDoc=function(){ return db.collection('settings').doc('auth') };
  var loadAuth=function(email){ if(!enabled||!db) return Promise.reject('disabled'); email=(email||((user()&&user().email)||'')).toLowerCase(); return settingsDoc().get().then(function(s){ var d=s.exists?s.data():null; if(!d||!d.accounts) return null; return d.accounts[email]||null; }) };
  var saveAuth=function(email,payload){ if(!enabled||!db) return Promise.reject('disabled'); if(!isOwner()) return Promise.reject('forbidden'); email=(email||((user()&&user().email)||'')).toLowerCase(); var data={}; data['accounts']= {}; data.accounts[email]=payload; return settingsDoc().set(data,{merge:true}) };
  return {enabled:enabled, app:app, auth:auth, db:db, login:login, logout:logout, user:user, isOwner:isOwner, ownerEmails:ownerEmails, onAuth:onAuth, loadHours:loadHours, saveHours:saveHours, loadAuth:loadAuth, saveAuth:saveAuth};
})();
