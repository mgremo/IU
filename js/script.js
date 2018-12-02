"use strict"

let data = {
    vms: [
        {
            name: "Linux1",
            state: "off",
            ram: 2048,
            hdd: 20480,
            cpu: 100,
            cores: 1
        },
        {
            name: "Linux2",
            state: "on",
            ram: 2048,
            hdd: 20480,
            cpu: 100,
            cores: 1
        },
        {
            name: "Linux3",
            state: "sleep",
            ram: 2048,
            hdd: 20480,
            cpu: 100,
            cores: 1
        },
    ],
    groups: [
        {
            name: 'All', 
            members: ['Linux1', 'Linux2', 'Linux3'],
            groupMembers: ['Linux']
        },
        {
            name: 'Linux', 
            members: ['Linux1', 'Linux2', 'Linux3'],
            groupMembers: ['GroupMembers1', 'GM2', 'GM3'],
            father: 'All',
        }
    ]
  };

  function createGroupItem(group, active) {
    const html = [
        '<li id="grp_',
        group.name,
        '" ',
        'class= "',
        'list-group-item ',
        active,
        ' d-flex justify-content-between align-items-center list-group-item-action" ',
        ' data-toggle="list" role="tab" aria-controls="" ',
        ' ">',
        group.name,
        '<span class="badge badge-primary badge-pill" title=',
        group.members.join(' '),
        '>',
        group.members.length,
        '</span>',
        '</li>'
    ];
    return $(html.join(''));
    }
    
    function findGroupById(id){
        let i = 0;
        for(var g of data.groups){
            if(g.name === id)
                return {o: g,index: i};
            i++;
        }
    }
    function getGroupName(list_name){
        //Hay que borrar los 4 primeros caracteres (grp_)
        return list_name.slice(3);
    }
  function findVmsById(id){
    for(let i = 0; i < data.vms.length; i++){
        if(data.vms[i].name === id) return data.vms[i];
    }
  };
  function getActiveGroup(){
    let group = $("#group-list");
    let i = 0;
    for(var g of group[0].childNodes){
        if($(g).hasClass("active")){
            console.log(g);
            return {object: g,index: i};
        }
        i++;
    }
  }

  function createHTMLGroupList(){

  }

  //Carga la lista de grupos al iniciar la pagina
  $(document).ready(function(){
    $("#group-list").empty();
    $("#group-list").append(createGroupItem(data.groups[0],'active'));

    for(let i = 1; i < data.groups.length; i++){
        $("#group-list").append(createGroupItem(data.groups[i],""));
    }
    console.log("UN METWO SHINY");
  });

  $(document).ready(function(){
    data.groups.forEach( m =>$("#group-list").click(function() {

        $("#vm-icons").empty();
        
        let back = document.createElement("img");
        back.setAttribute("class", "vm-icon");
        (document).getElementById("vm-icons").appendChild(back);

        back.src = './images/back.png'; 
        m.members.forEach(function(element){
            let vm = findVmsById(element);
            console.log(vm.name);
            let elem = document.createElement("img");

            if(vm.state === "on")  elem.src = './images/greenVM.png'; 
            else if(vm.state === "off")  elem.src = './images/redVM.png'; 
            else if(vm.state === "sleep") elem.src = './images/yellowVM.png'; 

            elem.setAttribute("class", "vm-icon");
            (document).getElementById("vm-icons").appendChild(elem);
        })
    }));
  });

  

  //Al pulsar ADD VM, crea una y refresca
  $(document).ready(function(){
    //ADD GRUPO
    $("#add-group").click(function() {
        console.log('Nuevo Grupo'); 

        let inputName = document.getElementById("add-group-name").value;

        data.groups.push({name : inputName, members: ['VM 1', 'VM 2']});
        //Refrescar lista
        $("#group-list").append(createGroupItem(data.groups[data.groups.length - 1],""));
        getActiveGroup();
      });

    //ADD VM
    $("#add-vm").click(function() {
    console.log('Nueva VM'); 

    let inputName = document.getElementById("add-vm-name").value;
    let inputRam = document.getElementById("add-vm-ram").value;
    let inputHDD = document.getElementById("add-vm-hd").value;
    let inputCPU = document.getElementById("add-vm-cpu").value;
    let inputCores = document.getElementById("add-vm-cores").value;
    //let inputIP = document.getElementById("add-vm-ip").value;

    data.vms.push({name :inputName, ram :inputRam, hdd:inputHDD , cpu:inputCPU , cores: inputCores});
    });

    $("#delete-group").click(function() {
        //Primero obtenemos el grupo que esta activo y guardamos sus datos
        //(Tanto los del DOM como los de data)
        let g = getActiveGroup(); //Grupo en el DOM
        let data_grp = findGroupById(getGroupName(g.object.id)); //Grupo en data
        
        //Si es all no hacemos nada (No se puede borrar all)
        if(g.index == 0){
            alert("Cannot delete \"All\" ");
            return;}
        //Luego borramos el elemento del DOM (Y ponemos el grupo activo en all)
        $("#group-list")[0].removeChild(g.object);
        $("#grp_All").addClass("active");

        //Finalmente se borra el grupo de data, borrando la entrada de todos sitios (Registro general, all y sus padre)
        

    });
});