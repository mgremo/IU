"use strict"

let data = {
    vms: [
        {
            name: "Linux1",
            ram: 2048,
            hdd: 20480,
            cpu: 100,
            cores: 1
        },
        {
            name: "Linux2",
            ram: 2048,
            hdd: 20480,
            cpu: 100,
            cores: 1
        },
        {
            name: "Linux3",
            ram: 2048,
            hdd: 20480,
            cpu: 100,
            cores: 1
        },
    ],
    groups: [
        {
            name: 'Linux', 
            members: ['Linux1', 'Linux2', 'Linux3']
        }
    ]
  };

  function creaLista(elem) {
    return "<a class= 'list-group-item list-group-item-action'>" + elem;  // se puede poner el active
  };

  //Carga la lista de grupos al iniciar la pagina
  $(document).ready(function(){
    $("#group-list").empty();
    data.groups.forEach( m => $("#group-list").append(creaLista(m.name)));
    console.log("UN METWO SHINY");
  });


  //Al pulsar ADD VM, crea una y refresca
  $(document).ready(function(){
    $("#add-group").click(function() {
        console.log('Nuevo Grupo'); 
        data.groups.push({name :'Group', members: ['VM 1', 'VM 2']});
        //Refrescar lista
        $("#group-list").empty();
        data.groups.forEach( m => $("#group-list").append(creaLista(m.name)));
      });
    $("#add-vm").click(function() {
    console.log('Nueva VM'); 
    data.vms.push({name :'NuevaVM', ram : 1, hdd: 2 , cpu: 3 , cores: 4});
    //Refrescar lista
    $("#group-list").empty();
    data.vms.forEach( m => $("#group-list").append(creaLista(m.name)));
    });
});