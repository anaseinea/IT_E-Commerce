var tag = 'all';
(function(){
    
    
    var config = {
            apiKey: "AIzaSyC-2UOMd7CS8yT7FSMzqiXrTyd2dBjSfFg",
            authDomain: "it-in-e-comm.firebaseapp.com",
            databaseURL: "https://it-in-e-comm.firebaseio.com",
            projectId: "it-in-e-comm",
            storageBucket: "it-in-e-comm.appspot.com",
            messagingSenderId: "347563138555"
          };
          firebase.initializeApp(config);
            
            
            putTheProds();
    
        
        firebase.auth().onAuthStateChanged(user =>{
            var logout = document.getElementById("logout");
            var logoutm = document.getElementById("logoutm");
            var login = document.getElementById("loginModal");
            var loginm = document.getElementById("loginModalm");
            if(user){
                console.log("logged in");
                Materialize.toast('Wellcome you are logged in !', 3000);
                updateKart(user);
                logout.classList.remove("hide");
                logoutm.classList.remove("hide");
                login.classList.add("hide");
                loginm.classList.add("hide");
            }else{
                Materialize.toast('Wellcome login if you want to buy something', 3000);
                console.log("wrong info not loged in");
                logout.classList.add("hide");
                logoutm.classList.add("hide");
                login.classList.remove("hide");
                loginm.classList.remove("hide");
            }
            
        });
    
    
            
    
    
}());
function putTheProds(){
    var products = document.getElementById('products');
            var ref = firebase.database().ref().child('products');
            
            ref.on('value', snap => {
                products.innerHTML = "";
                //prompt(JSON.stringify(snap.val(),null,3));
               
                var prods = JSON.parse(JSON.stringify(snap.val(),null,3));
                for(var i=0;i<prods.length;i++){
                 //prompt(prods[1].name);
                    if(tag != 'all')
                        if(tag != prods[i].tag)
                            continue;
                
                products.innerHTML += '<div class="col s12 m6 l4"><div class="card hoverable">'
               +' <div class="card-image waves-effect waves-block waves-light">'
                  +'<img class="activator" src="https://firebasestorage.googleapis.com/v0/b/it-in-e-comm.appspot.com/o/'+prods[i].image 
                      +'?alt=media&token=e3874610-eac5-4454-903e-082deb5e2bbb">'
                    
                    +'</div>'
                +'<div class="card-content">'
                    +'<a onclick="addToKart('+i+')" style="bottom: auto;" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">shopping_cart</i></a>'
                  +'<span class="card-title activator grey-text text-darken-4" style="font-size:1.2rem;">'+prods[i].disc
                   + '<i class="material-icons right">more_vert</i></span>'
                    
                    +'<p style="color: orange;">'+prods[i].price+' AED</p>'
                  +'</div><div class="card-reveal">'
                  +'<span class="card-title grey-text text-darken-4">Discription<i class="material-icons right">close</i></span>'
                  +'<p>'+prods[i].discL+'</p>'
               +' </div>'
             +' </div></div>';
                }
            });
}
function setTag(ta){tag = ta;putTheProds();}
function signIn(){
    var pass = document.getElementById("password").value;
    var email = document.getElementById("email").value;
    var auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email,pass);
    promise.catch(e => {//console.log(e.message)
                       if(e.message.includes("There is no user record corresponding to this identifier"))
                           Materialize.toast('User doesnt exist, create one !', 3000);//console.log("no user with this email exists");
                        else if(e.message.includes("The password is invalid"))
                            Materialize.toast('Wrong password', 3000);//console.log("wrong pass");
                       });
}
function signUp(){
    var pass = document.getElementById("password").value;
    var email = document.getElementById("email").value;
    var auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email,pass);
    
   // console.log(promise);

    promise.catch(e => {//console.log(e.message)
                       if(e.message.includes("The email address is badly formatted"))
                           Materialize.toast('Wrong email', 3000);//console.log("wrong email");
                        else if(e.message == "")
                            prompt("nothing in message");
                       });
   
    setTimeout(checkUser, 2000);
    
}
function checkUser(){
    var unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          var u = {} ;
        u[user.email.replace('.','@')] = {'kart':'o','money':10000};
        firebase.database().ref().child("users").update(u);
        // User is signed in.
      } else {
          Materialize.toast('Something went wrong', 3000);
        // No user is signed in.
      }
    });
    unsubscribe();
}
function logout(){
    firebase.auth().signOut();
    var kartEl = document.getElementById('kart');
    var kartElm = document.getElementById('kartm');
    if(!kartEl.classList.contains('hide')){
        kartEl.classList.add('hide');
        kartElm.classList.add('hide');
    }
}

function addToKart(i){
    //console.log('new kart is yolo');
    var unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          var u = {} ;//= user.email+":['kart':'','money':10000]";
        
        var us = firebase.database().ref().child("users").child(user.email.replace('.','@'));
          us.child("kart").once('value',snap =>{//var us = firebase.database().ref().child("users").child(user.email.replace('.','@'));
                                  if(snap.val() != 'o'){
                                      u['kart'] = snap.val() +','+i;
                                      //Materialize.toast('kart wasnt o it was '+snap.val(), 3000);
                                  }
                                  else{
                                    u['kart'] =  i;
                                   //console.log("kart is " + u['kart'])   ;
                                  }
                                    if(u['kart'][0] ==',')
                                        u['kart'] = u['kart'].slice(1);
                                  console.log('new kart is '+u['kart']);
                                  us.update(u);
                                  updateKart(user);
                                  });
          
          
        // User is signed in.
      } else {
          $('#modal1').modal('open');
        // No user is signed in.
      }
    });
    unsubscribe();
}
var tot;
var mon;
function updateKart(user){
    var us = firebase.database().ref().child("users").child(user.email.replace('.','@'));
          us.child("kart").once('value',snap =>{
                                              
              
                                                var kartEl = document.getElementById('kart');
                                                var kartElm = document.getElementById('kartm');
                                                console.log(snap.val());
                                                if(snap.val() == 'o' || snap.val() == ''){
                                                    if(!kartEl.classList.contains('hide')){
                                                        kartEl.classList.add('hide');
                                                        kartElm.classList.add('hide');
                                                    }
                                                        
                                                }else{
                                                    if(kartEl.classList.contains('hide')){
                                                        kartEl.classList.remove('hide');
                                                        kartElm.classList.remove('hide');
                                                    }
                                                    var kart = snap.val()+'';
                                                    var kartModal = document.getElementById('kartModal');
                                                    kartModal.innerHTML = '<h4  class="center">Shopping kart</h4>';
                                                    var kartProds;
                                                    if(kart.includes(','))
                                                        kartProds = kart.split(',');
                                                    else
                                                        kartProds = kart;
                                                    var ref = firebase.database().ref().child('products');
                                                    console.log("kart array is "+kartProds);
                                                    ref.once('value', snap => {

                                                        var prods = JSON.parse(JSON.stringify(snap.val(),null,3));
                                                        console.log("prods array is "+prods);
                                                        var total = 0;
                                                        for(var i=0;i<kartProds.length;i++){
                                                            total += prods[parseInt(kartProds[i])].price;
                                                        kartModal.innerHTML +=
                                            '<div class="col s12">'
                                           + '<div class="card horizontal">'
                                             + '<div class="card-image">'
                   + '<img style="height:130px;" src="https://firebasestorage.googleapis.com/v0/b/it-in-e-comm.appspot.com/o/'
                        +prods[parseInt(kartProds[i])].image 
                                            +'?alt=media&token=e3874610-eac5-4454-903e-082deb5e2bbb"></div>'
                                             + '<div class="card-stacked">'
                                               + '<div class="card-content"><p>'
                                               +   prods[parseInt(kartProds[i])].disc
                                               + '</p><p class="right-align">'+prods[parseInt(kartProds[i])].price+' AED</p></div>'
                                                +'<div class="card-action">'
                                                 + '<a onclick="removeFromKart('+i+')" href="#" class="red-text center-align">Remove item</a>'
                                               + '</div></div></div></div>'
                                                        }
                                                        tot = total;
                                                        us.child("money").once('value',snap =>{mon = snap.val(); kartModal.innerHTML += 
                                                        '<p class="center-align">Total amount: '+total+'<br/>Your balance: '+snap.val()+'</p>';
                                                        });
                                                    });

                                                }
                                               });
}
function removeFromKart(i){
    var unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          var u = {} ;
        
        var us = firebase.database().ref().child("users").child(user.email.replace('.','@'));
          us.child("kart").once('value',snap =>{
                                    k = snap.val().split(',');
                                    u['kart'] = '';
                                    for(var e=0;e<k.length;e++){
                                        if(e != i)
                                            u['kart'] +=k[e]+',';
                                    }
                                    u['kart'] = u['kart'].slice(0, -1);
                                  
                                  us.update(u);
                                  updateKart(user);
                                  });
          
          
        // User is signed in.
      } else {
         // $('#modal1').modal('open');
        // No user is signed in.
      }
    });
    unsubscribe();
}
function buyAll(){
    console.log("total is "+tot+"   money is "+mon);
    var unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          var u = {} ;
        
        var us = firebase.database().ref().child("users").child(user.email.replace('.','@'));
          us.child("kart").once('value',snap =>{
                                    u['kart'] = '';
                                  us.update(u);
                                  updateKart(user);
                                  });
          
          us.child("money").once('value',snap =>{
                                    
                                    mon = mon - tot;
                                    tot = 0;
                                    u['money'] = mon;
                                  us.update(u);
                                  });
        // User is signed in.
      }
});
}
$( document ).ready(function(){$(".button-collapse").sideNav();
                              $('.modal').modal({startingTop: '40%', // Starting top style attribute
      endingTop: '10%'});
                              
                              })