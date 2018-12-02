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

function createBadge(group){
    let badge = [
    group.name,
    '<span class="badge badge-primary badge-pill" title=',
    group.members.join(' '),
    '>',
    group.members.length,
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
}

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
        child_group.o.childGroups[parent_grp.index] = grp_name;
    }
    grp_data.name = grp_name;
    
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

        elem.setAttribute("class", "vm-icon");
        (document).getElementById("vm-icons").appendChild(elem);
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

        //Primero hay que borrar la entrada de todos los grupos que lo tuvieran como padre
        if (data_grp.o.parents.length > 0) {
            //Vamos a todos los padres del grupo a borrar
            for (var p_group_name of data_grp.o.parents) {
                //Y borramos la entrada en los datos del padre
                let p_group = findGroup(p_group_name);
                let child_group = findChildGroup(grp_name, p_group.o);
                p_group.o.childGroups.slice(child_group.index, 1);
            }
        }
        //Finalmente borramos el grupo de los datos
        data.groups.slice(data_grp.index, 1);
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
        $(g.object)[0].innerHTML = createBadge(grp_data.o);
        $(g.object)[0].id = "grp_" + inputName;

    });

});