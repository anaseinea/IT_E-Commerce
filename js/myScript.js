//var kart = '';
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
            
            
            var products = document.getElementById('products');
            var ref = firebase.database().ref().child('products');
            
            ref.on('value', snap => {
                products.innerHTML = "";
                //prompt(JSON.stringify(snap.val(),null,3));
               
                var prods = JSON.parse(JSON.stringify(snap.val(),null,3));
                for(var i=0;i<prods.length;i++){
                 //prompt(prods[1].name);
                
                products.innerHTML += '<div class="col s12 m6 l4"><div class="card hoverable">'
               +' <div class="card-image waves-effect waves-block waves-light">'
                  +'<img class="activator" src="https://firebasestorage.googleapis.com/v0/b/it-in-e-comm.appspot.com/o/'+prods[i].image 
                      +'?alt=media&token=e3874610-eac5-4454-903e-082deb5e2bbb">'
                    
                    +'</div>'
                +'<div class="card-content">'
                    +'<a onclick="addToKart('+i+')" style="bottom: auto;" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">shopping_cart</i></a>'
                  +'<span class="card-title activator grey-text text-darken-4" style="font-size:1.2rem;">'+prods[i].disc+
                   + '<i class="material-icons right">more_vert</i></span>'
                    
                    +'<p style="color: orange;">'+prods[i].price+' AED</p>'
                  +'</div><div class="card-reveal">'
                  +'<span class="card-title grey-text text-darken-4">Discription<i class="material-icons right">close</i></span>'
                  +'<p>'+prods[i].discL+'</p>'
               +' </div>'
             +' </div></div>';
                }
            });
    
        
        firebase.auth().onAuthStateChanged(userInfo =>{
            var logout = document.getElementById("logout");
            var login = document.getElementById("loginModal");
            if(userInfo){
                console.log("logged in");
                Materialize.toast('Wellcome you are logged in !', 3000);
                logout.classList.remove("hide");
                login.classList.add("hide");
            }else{
                Materialize.toast('Wellcome login if you want to buy something', 3000);
                console.log("wrong info not loged in");
                logout.classList.add("hide");
                login.classList.remove("hide");
            }
            
        });
    
    
            
    
    
}());
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
                                      Materialize.toast('kart wasnt o it was '+snap.val(), 3000);
                                  }
                                  else{
                                    u['kart'] =  i;
                                   console.log("kart is " + u['kart'])   ;
                                  }
                                  console.log('new kart is '+u['kart']);
                                  us.update(u);
                                  updateKart(u['kart']);
                                  });
          
          
        // User is signed in.
      } else {
          $('#modal1').modal('open');
        // No user is signed in.
      }
    });
    unsubscribe();
}

function updateKart(kart){
    var kartEl = document.getElementById('kart');
    if(kart == ''){
        if(!kartEl.classList.contains('hide'))
            kartEl.addClass('hide');
    }else{
        if(kartEl.classList.contains('hide'))
            kartEl.classList.remove('hide');
        
    }
}

$( document ).ready(function(){$(".button-collapse").sideNav();
                              $('.modal').modal();
                              
                              })