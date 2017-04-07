$(document).ready(function(){
  $("#commune").autocomplete({
      source : function(requete, response){
      $.ajax({
              url : 'http://infoweb-ens/~jacquin-c/codePostal/commune.php', // on appelle le script JSON
              type: 'GET',
              dataType : 'json', // on spécifie bien que le type de données est en JSON
              data : 'commune='+$("#commune").val()+"&maxRows=10",
              success: function (data){
              	response($.map(data, function (item){
              		return {
              			label: item.Ville,
                    value: item.Ville
              		}
              	}));
              }
          });//fin ajax
      }
  });

  $( function() {
    $( "#tabs" ).tabs();
  });
  $('button[type=submit]').button({icons: {primary: 'ui-icon-circle-zoomin'}}).click(function (event) {
  event.preventDefault();
  });

  var tableau = $('#myTable').DataTable();

  $("#rechercher").on('click',  function(event){
    $("#images").empty();
    tableau.clear();


    window.infos="";
    window.src="";



      var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=595c96c581cabd128a0abb3f9a581c3e'+
              '&tags=' + $("#commune").val()+
              '&per_page=' + $("#nbphotos").val() +
              '&format=json&nojsoncallback=1&safesearch=1';
      $.ajax({
          url:url,
          type:'GET',
          dataType:'jsonp',
          jsonp: 'jsoncallback', // a renseigner d'après la doc du service, par défaut callback

          success:function(data){


              var compteur = 0;
              var modal = $("<div/>").css("display", "none");
              
              for (photo of data.photos.photo){

                  window.src ='http://farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret;
                  var image = $("<img/>").attr("src", window.src+'_m.jpg');
                  var urlInfos = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=595c96c581cabd128a0abb3f9a581c3e'+
                              '&photo_id='+photo.id+
                              '&secret='+photo.secret+
                              '&format=json&nojsoncallback=1';

                  $.ajax({
                      url:urlInfos,
                      type:'GET',
                      dataType:'jsonp',
                      jsonp: 'jsoncallback', // a renseigner d'après la doc du service, par défaut callback

                      success:function(data){
                          var date = data.photo.dates.taken.split(" ")[0].split("-");
                          var heure = data.photo.dates.taken.split(" ")[1].split(":");
                          window.publication = date[2]+"/"+date[1]+"/"+date[0]+" à "+heure[0]+":"+heure[1];

                          window.titre = data.photo.title._content;
                          window.auteur = data.photo.owner.username;
                          window.resume = data.photo.description._content;
                          var urlimgTab='http://farm'+data.photo.farm+'.staticflickr.com/'+data.photo.server+'/'+data.photo.id+'_'+data.photo.secret;
                          tableau.row.add( [
                                '<img src="'+urlimgTab+'_m.jpg"/>' ,
                                window.titre,
                                window.publication,
                                window.auteur
                          ] ).draw( false );

                          image.appendTo("#images");





                    },
                      error: function(resultat,statut,erreur){

                      }

                      });
                  image.click( function () {
                      modal.dialog({
                      dialogClass: "alert",
                      modal:"true"
                      });
                      modal.css( "display", "block" );
                      var srcHigh = $(this).attr("src");
                      var urlhd =srcHigh.substr(0, srcHigh.length-6)+"_h.jpg";
                      window.infos = '<div class="modal_container">' +'<img class="img-modal"  src="'+urlhd+'"/>';
                      modal.html(window.infos+'<div class="modal_infos"><p>'+window.titre+'</p><p>'+window.auteur+'</p><p>'+window.resume+'</p></div></div>');
                      if(data.photo.location){

                      }




                  });
                  image.appendTo("#images");

              }



          },
          error: function(resultat,statut,erreur){
          console.log("erreur");
          }
           });



});

});
