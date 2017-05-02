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
                    +'<a class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">shopping_cart</i></a>'
                    +'</div>'
                +'<div class="card-content">'
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
}());


$( document ).ready(function(){$(".button-collapse").sideNav();
                              $('.modal').modal();
                              
                              })