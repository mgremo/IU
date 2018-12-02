"use strict"

let data = {
    vms: [
        {
            name: "Linux1",
            state: "off",
            ram: 20,
            hdd: 204,
            cpu: 98,
            cores: 2,
            ip: "216.3.126.12",
            iso: "vm1.iso"
        },
        {
            name: "Linux2",
            state: "on",
            ram: 2048,
            hdd: 20480,
            cpu: 100,
            cores: 1,
            ip: "216.3.126.10",
            iso: "vm2.iso"
        },
        {
            name: "Linux3",
            state: "sleep",
            ram: 3000,
            hdd: 20480,
            cpu: 50,
            cores: 20,
            ip: "216.3.888.12",
            iso: "vm3.iso"
        },
    ],
    groups: [
        {
            name: 'All',
            members: ['Linux1', 'Linux2', 'Linux3'],
            groupMembers: ['Linux'],
            parents: [],
            childGroups: ['Linux']
        },
        {
            name: 'Linux',
            members: ['Linux1', 'Linux2', 'Linux3'],
            groupMembers: ['GroupMembers1', 'GM2', 'GM3'],
            parents: ['All'],
            childGroups: [],
        }
    ]
};

//Crea la cuenta de los elementos del grupo
function createBadge(group){
    let badge = [
    group.name,
    '<span class="badge badge-primary badge-pill" title=',
    group.members.join(' '),
    '>',
    group.members.length + group.childGroups.length,
    '</span>'
    ];
    return badge.join('');
}

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
        createBadge(group),
        '</li>'
    ];
    return $(html.join(''));
}

function updateHTMLGroups(){
    for (var grp of data.groups) {
        console.log(grp);
        updateHTMLGroup($("#grp_" + grp.name)[0],grp);
    }
}

//Actualiza el elemento HTML de un grupo
function updateHTMLGroup(grp_dom, grp_data){
    grp_dom.innerHTML = createBadge(grp_data);
    grp_dom.id = "grp_" + grp_data.name;
}

//Devuelve el index y el grupo con nombre "name"
function findGroup(name) {
    let i = 0;
    for (var g of data.groups) {
        if (g.name === name)
            return { o: g, index: i };
        i++;
    }
};

//Devuelve el indice del grupo hijo(name) en el grupo padre(parent)
//Coste(O(n) siendo n el numero de hijos del padre)
function findChildGroup(name, parent) {
    let i = 0;
    for (var child_name of parent.childGroups) {
        if (child_name === name)
            return { o: child_name, index: i };
        i++;
    }
}
//Devuelve el indice del grupo padre(name) en el grupo hijp(parent)
//Coste(O(n) siendo n el numero de hijos del padre)
function findParentGroup(name, childs) {
    let i = 0;
    for (var parent_name of childs.parents) {
        if (parent_name === name)
            return { o: parent_name, index: i };
        i++;
    }
}

//Devuelve el nombre del grupo respecto al nombre de la lista html (grp_All -> All)
function getGroupName(list_name) {
    //Hay que borrar los 4 primeros caracteres (grp_)
    return list_name.slice(4);
};

function findVmsById(id) {
    for (let i = 0; i < data.vms.length; i++) {
        if (data.vms[i].name === id) return data.vms[i];
    }
};

//Devuelve el index en la lista del grupo activo y su elemento html
function getActiveGroup() {
    let group = $("#group-list");
    let i = 0;
    for (var g of group[0].childNodes) {
        if ($(g).hasClass("active")) {
            console.log(g);
            return { object: g, index: i };
        }
        i++;
    }
};

function showDetails(vm){
    let ram = document.getElementById("details-vm-ram");
    ram.placeholder = vm.ram;
    let cpu = document.getElementById("details-vm-cpu");
    cpu.placeholder = vm.cpu;
    let ip = document.getElementById("details-vm-ip");
    ip.placeholder = vm.ip;
    let cores = document.getElementById("details-vm-cores");
    cores.placeholder = vm.cores;
    let iso = document.getElementById("details-vm-iso");
    iso.placeholder = vm.iso;
    let hdSize = document.getElementById("details-vm-hd");
    hdSize.placeholder = vm.hdd;
};

function selectImage(vm){

    let g = getActiveGroup();

    let name = getGroupName(g.object.id);

    let o = findGroup(name);

    o.o.members.forEach(function(element){
        let vm = findVmsById(element);
        if (vm != undefined) {
            if (vm.state === "on") vm.elem.src = './images/greenVM.png';
            else if (vm.state === "off") vm.elem.src = './images/redVM.png';
            else if (vm.state === "sleep") vm.elem.src = './images/yellowVM.png';
        }
    });

    let vm_ = findVmsById(vm.name);

    if (vm_ != undefined) {
        if (vm_.state === "on") vm_.elem.src = './images/selectedGreenVM.png';
        else if (vm_.state === "off") vm_.elem.src = './images/selectedRedVM.png';
        else if (vm_.state === "sleep") vm_.elem.src = './images/selectedYellowVM.png';
    }
};

function changeGroupName(grp_name,grp_data){
    //Hay que cambiar el nombre del registro de los padres
    let old_name = grp_data.name;
    for(let parent_name of grp_data.parents){
        let parent_grp = findGroup(parent_name);
        let child_grp = findChildGroup(old_name,parent_grp.o);
        parent_grp.o.childGroups[child_grp.index] = grp_name;
    }
    //Tambien hay que cambiar el nombre en el registro de los hijos
    for(let child_name of grp_data.childGroups){
        let child_group = findGroup(child_name);
        let parent_grp = findParentGroup(old_name, child_group.o);
        child_group.o.parents[parent_grp.index] = grp_name;
    }
    grp_data.name = grp_name;
    
}
function removeGroup(grp_name,grp_data){
    //Primero borramos el grupo de los registros padre
    for(let parent_name of grp_data.parents){
        let parent_grp = findGroup(parent_name);
        let child_grp = findChildGroup(old_name,parent_grp.o);
        parent_grp.o.childGroups.slice(child_grp.index,1);
    }
    //Tambien hay que cambiar el nombre en el registro de los hijos
    for(let child_name of grp_data.childGroups){
        let child_grp = findGroup(child_name);
        let parent_grp = findParentGroup(old_name, child_grp.o);
        child_grp.o.parents.slice(parent_grp.index,1);
    }

    //Finalmente borramos el grupo de los datos
    data.groups.slice(data_grp.index, 1);
}
function removeChildGroup(grp_data,grp_name){
    let index = 0;
    for(let child_name of grp_data.childGroups){
        if(child_name == grp_name){
            grp_data.childGroups.slice(index,1);
        }
        index++;
    }
}
function addChildGroup(grp_data,grp_name){
    grp_data.childGroups.push(grp_name);
}

//Para activar / desactivar los botones si no hay ninguno seleccionado
function toggleGroupButtons(disabled) {

    $("#edit-group").prop("disabled", disabled);
    $("#delete-group").prop("disabled", disabled);
    $("#delete-group")[0].setAttribute("aria-disabled", disabled);
    $("#edit-group")[0].setAttribute("aria-disabled", disabled);
}

function images() {

    let name = getGroupName(this.id);

    let g = findGroup(name);

    //En caso de que sea "All" hay que desactivar las cosas
    toggleGroupButtons((g.index === 0));
    console.log(g);

    $("#vm-icons").empty();

    let back = document.createElement("img");
    back.setAttribute("class", "vm-icon");
    (document).getElementById("vm-icons").appendChild(back);

    back.src = './images/back.png';
    g.o.members.forEach(function (element) {

        let vm = findVmsById(element);
        console.log(vm);

        let elem = document.createElement("img");

        if (vm != undefined) {
            if (vm.state === "on") elem.src = './images/greenVM.png';
            else if (vm.state === "off") elem.src = './images/redVM.png';
            else if (vm.state === "sleep") elem.src = './images/yellowVM.png';
        }
        
        vm.elem = elem;

        var box = document.createElement("input");
        box.value = vm.name;
        box.readOnly = true;
        box.setAttribute("class", "img-with-text");

        elem.onclick = function() { let vm = findVmsById(this.name); showDetails(vm); selectImage(vm); };
        
        elem.setAttribute("name", element);
        elem.setAttribute("class", "vm-icon");
        elem.setAttribute("id", "detail_button");
        
        (document).getElementById("vm-icons").appendChild(elem);
        (document).getElementById("vm-icons").appendChild(box);
    });
}

//Carga la lista de grupos al iniciar la pagina
$(document).ready(function () {
    $("#group-list").empty();
    let all = createGroupItem(data.groups[0], 'active')
    $("#group-list").append(all);
    let allO = (document).getElementById(all[0].id);
    allO.onclick = images;

    for (let i = 1; i < data.groups.length; i++) {
        let g = createGroupItem(data.groups[i], "");
        $("#group-list").append(g);
        let o = (document).getElementById(g[0].id);
        o.onclick = images;
    }
    toggleGroupButtons(true);
    console.log("UN METWO SHINY");
});

/*$(document).ready(function(){
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
});*/



//Al pulsar ADD VM, crea una y refresca
$(document).ready(function () {
    //ADD GRUPO
    $("#add-group").click(function () {
        console.log('Nuevo Grupo');

        let inputName = document.getElementById("add-group-name").value;

        data.groups.push({ name: inputName, members: ['VM 1', 'VM 2'], parents: ['All'], childGroups: [] });
        data.groups[0].childGroups.push(inputName);
        //Refrescar lista
        let g = createGroupItem(data.groups[data.groups.length - 1], "");
        $("#group-list").append(g);
        let o = (document).getElementById(g[0].id);
        o.onclick = images;
        getActiveGroup();
        updateHTMLGroups();
    });

    //ADD VM
    $("#add-vm").click(function () {
        console.log('Nueva VM');

        let inputName = document.getElementById("add-vm-name").value;
        let inputRam = document.getElementById("add-vm-ram").value;
        let inputHDD = document.getElementById("add-vm-hd").value;
        let inputCPU = document.getElementById("add-vm-cpu").value;
        let inputCores = document.getElementById("add-vm-cores").value;
        //let inputIP = document.getElementById("add-vm-ip").value;

        data.vms.push({ name: inputName, ram: inputRam, hdd: inputHDD, cpu: inputCPU, cores: inputCores });
        data.groups[0].members.push(inputName);
        updateHTMLGroups();
    });


    //BORRAR GRUPO
    $("#confirm-delete-group").click(function () {
        //Primero obtenemos el grupo que esta activo y guardamos sus datos
        //(Tanto los del DOM como los de data)
        let g = getActiveGroup(); //Grupo en el DOM
        let grp_name = getGroupName(g.object.id);
        let data_grp = findGroup(grp_name); //Grupo en data
        console.log("Group to delete: " + grp_name);
        //Si es all no hacemos nada (No se puede borrar all)
        if (g.index == 0) {
            alert("Cannot delete \"All\" ");
            return;
        }
        //Luego borramos el elemento del DOM (Y ponemos el grupo activo en all)
        $("#group-list")[0].removeChild(g.object);
        $("#grp_All").addClass("active");
        toggleGroupButtons(true);

        //Finalmente se borra el grupo de data, borrando la entrada de todos sitios (Registro general, all y sus padre)

        removeGroup(grp_name,grp_data.o);
        updateHTMLGroups();
    });


    $("#confirm-edit-group").click(function () {
        console.log("Editar Grupos");
        //Primero obtenemos el grupo que esta activo y guardamos sus datos
        //(Tanto los del DOM como los de data)
        let g = getActiveGroup(); //Grupo en el DOM
        let grp_name = getGroupName(g.object.id);
        let grp_data = findGroup(grp_name); //Grupo en data
        console.log("Group to edit: " + grp_name);

        //Cambios:

        //Primero se cambia el nombre
        let inputName = document.getElementById("edit-group-name").value;
        
        changeGroupName(inputName,grp_data.o);

        //Despues borramos los elementos
        let remove_grps = document.getElementById("delete-group-items").value;
        //Para cada grupo, hay que borrarlo de la lista de hijos de este grupo
        for(var remove_item of remove_grps){
            removeChildGroup(grp_data.o,remove_item);
        }

        //Despues añadimos los grupos
        let add_grps = document.getElementById("edit-group-items").value;
        for(var add_item of add_grps){
            addChildGroup(grp_data.o,add_item);
        }

        //Finalmente actualizamos el html
        updateHTMLGroup($(g.object),grp_data.o);
    });

});