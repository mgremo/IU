"use strict"

const EDIT_ADD_ITEMS = 0;
const EDIT_RMV_ITEMS = 1;
const ADD_GROUP_ITEMS = 2;

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
        {
            name: "Linux4",
            state: "sleep",
            ram: 3000,
            hdd: 20480,
            cpu: 50,
            cores: 20,
            ip: "216.3.888.12",
            iso: "vm3.iso"
        },
        {
            name: "Linux5",
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
            members: ['Linux1', 'Linux2', 'Linux3', 'Linux4', 'Linux5'],
            parents: [],
            childGroups: ['Linux']
        },
        {
            name: 'Linux',
            members: ['Linux1', 'Linux2',],
            parents: ['All'],
            childGroups: [],
        }
    ],
    buffers: [[], []],
};

//Crea la cuenta de los elementos del grupo
function createBadge(group) {
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

function updateHTMLGroups() {
    for (var grp of data.groups) {
        console.log(grp);
        updateHTMLGroup($("#grp_" + grp.name)[0], grp);
    }
}

//Actualiza el elemento HTML de un grupo
function updateHTMLGroup(grp_dom, grp_data) {
    grp_dom.innerHTML = createBadge(grp_data);
    console.log("Nuevo nombre: " + grp_data.name);
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
function findChildVM(name, group) {
    let i = 0;
    for (var child_name of group.members) {
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

function getSelectedVM() {
    return data.selected_vm;
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

function showDetails(vm) {
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

function selectImage(vm) {

    let g = getActiveGroup();

    let name = getGroupName(g.object.id);

    let o = findGroup(name);

    o.o.members.forEach(function (element) {
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

function changeGroupName(grp_name, grp_data) {
    //Hay que cambiar el nombre del registro de los padres
    let old_name = grp_data.name;
    for (let parent_name of grp_data.parents) {
        let parent_grp = findGroup(parent_name);
        let child_grp = findChildGroup(old_name, parent_grp.o);
        parent_grp.o.childGroups[child_grp.index] = grp_name;
    }
    //Tambien hay que cambiar el nombre en el registro de los hijos
    for (let child_name of grp_data.childGroups) {
        let child_group = findGroup(child_name);
        let parent_grp = findParentGroup(old_name, child_group.o);
        child_group.o.parents[parent_grp.index] = grp_name;
    }
    grp_data.name = grp_name;

}
function removeGroup(grp_name, grp_data) {
    //Primero borramos el grupo de los registros padre
    for (let parent_name of grp_data.parents) {
        let parent_grp = findGroup(parent_name);
        let child_grp = findChildGroup(grp_name, parent_grp.o);
        parent_grp.o.childGroups.splice(child_grp.index, 1);
    }
    //Tambien hay que cambiar el nombre en el registro de los hijos
    for (let child_name of grp_data.childGroups) {
        let child_grp = findGroup(child_name);
        let parent_grp = findParentGroup(grp_name, child_grp.o);
        child_grp.o.parents.splice(parent_grp.index, 1);
    }

    //Finalmente borramos el grupo de los datos
    let index = findGroup(grp_data.name).index;
    data.groups.splice(index, 1);
}
function removeChildGroup(grp_data, grp_name) {
    let index = 0;
    for (let child_name of grp_data.childGroups) {
        if (child_name == grp_name) {
            console.log("Borrando " + child_name);
            grp_data.childGroups.splice(index, 1);
        }
        index++;
    }
}
function removeChildVM(grp_data, vm_name) {
    let index = 0;
    for (let child_name of grp_data.members) {
        if (child_name == vm_name) {
            console.log("Borrando " + child_name);
            grp_data.members.splice(index, 1);
        }
        index++;
    }
}
function addChildGroup(grp_data, grp_name) {
    //Lo añadimos a la lista de hijos
    //Primero vemos que no sea el propio grupo
    if (grp_name == grp_data.name)
        return;
    //Tambien hay que ver que no exista ya dentro del grupo
    for (var child of grp_data.childGroups) {
        if (child == grp_name)
            return;
    }
    grp_data.childGroups.push(grp_name);
    //Pero tambien hay que añadir el padre al hijo
    let child_grp = findGroup(grp_name);
    child_grp.o.parents.push(grp_data.name);

}
function addVM(grp_data, vm_name) {
    //Primero añadimos a la lista de miembros del grupo
    //Hay que comprobar que no este ya incluida, en cuyo caso no hacemos nada
    for (var aux_vm of grp_data.members) {
        if (aux_vm == vm_name)
            return;
    }
    grp_data.members.push(vm_name);
}

//Para activar / desactivar los botones si no hay ninguno seleccionado
function toggleGroupButtons(disabled) {

    $("#edit-group").prop("disabled", disabled);
    $("#delete-group").prop("disabled", disabled);
    $("#delete-group")[0].setAttribute("aria-disabled", disabled);
    $("#edit-group")[0].setAttribute("aria-disabled", disabled);
}
function toggleVMButtons(disabled) {
    $("#edit-vm").prop("disabled", disabled);
    $("#delete-vm").prop("disabled", disabled);
    $("#remove-vm").prop("disabled", disabled);
    $("#delete-vm")[0].setAttribute("aria-disabled", disabled);
    $("#edit-vm")[0].setAttribute("aria-disabled", disabled);
    $("#remove-vm")[0].setAttribute("aria-disabled", disabled);
}

function showGroup(group, list, callbacks, cols) {
    //Primero vaciamos la lista anterior
    list.empty();
    let callback;
    if (callbacks[0] === undefined)
        callback = callbacks;
    //Creamos las imagenes de fondo
    let container = (document).getElementById(list[0].id + "container-images");
    let act_row = 0;
    let act_col = 0;
    if (container == undefined) {
        container = document.createElement("div");
        container.setAttribute("class", "container");
        container.setAttribute("id", list[0].id + "container-images");
        list[0].appendChild(container);
    }
    let row = document.createElement("div");
    row.setAttribute("class", "row");
    row.setAttribute("id", list[0].id + "row-images" + act_row);
    container.appendChild(row);


    group.childGroups.forEach(function (element) {
        //Si no caben mas elementos en la columna actual, creamos otra fila
        if (act_col >= cols) {
            act_row++;
            //Creamos una nueva row y se la mentemos al container
            row = document.createElement("div");
            row.setAttribute("class", "row");
            row.setAttribute("id", list[0].id + "row-images" + act_row);
            container.appendChild(row);
            act_col = 0;
        }
        //Para cada elemento vamos a ir creando una columna nueva
        let col = document.createElement("div");
        col.setAttribute("class", "col-sm-" + 12 / cols);
        col.setAttribute("id", list[0].id + "col-images" + act_row + act_col);

        let elem = document.createElement("img");
        elem.src = './images/folder.png';
        var box = document.createElement("input");
        box.value = element;
        box.readOnly = true;
        box.setAttribute("class", "img-with-text");

        elem.onclick = callback;
        if (callbacks[2] != undefined)
            elem.ondblclick = callbacks[2];

        elem.setAttribute("name", element);
        elem.setAttribute("class", "vm-icon-list");
        elem.setAttribute("id", "detail_button");


        row.appendChild(col);
        col.appendChild(elem);
        col.appendChild(box);
        act_col++;

    });

    if (callbacks[1] == undefined)
        callback = callbacks;
    else
        callback = callbacks[1];
    //Y para cada miembro del grupo lo añadimos a la lista
    group.members.forEach(function (element) {
        //Si no caben mas elementos en la columna actual, creamos otra fila
        if (act_col >= cols) {
            act_row++;
            //Creamos una nueva row y se la mentemos al container
            row = document.createElement("div");
            row.setAttribute("class", "row");
            row.setAttribute("id", list[0].id + "row-images" + act_row);
            container.appendChild(row);
            act_col = 0;
        }
        //Para cada elemento vamos a ir creando una columna nueva
        let col = document.createElement("div");
        col.setAttribute("class", "col-sm-" + 12 / cols);
        col.setAttribute("id", list[0].id + "col-images" + act_row + act_col);

        let vm = findVmsById(element);
        let elem = document.createElement("img");

        if (vm != undefined) {
            let aux = getSelectedVM();
            if (vm.state === "on") elem.src = './images/greenVM.png';
            else if (vm.state === "off") elem.src = './images/redVM.png';
            else if (vm.state === "sleep") elem.src = './images/yellowVM.png';
            vm.elem = elem;

            var box = document.createElement("input");
            box.value = vm.name;
            box.readOnly = true;
            box.setAttribute("class", "img-with-text");

            elem.onclick = callback;

            elem.setAttribute("name", element);
            elem.setAttribute("class", "vm-icon-list");
            elem.setAttribute("id", "detail_button");


            row.appendChild(col);
            col.appendChild(elem);
            col.appendChild(box);
        }
        act_col++;

    });
}

function updateActiveGroup() {
    getActiveGroup().object.onclick();
}

function onVMListClick() {
    let vm = findVmsById(this.name);
    data.selected_vm = vm;
    showDetails(vm);
    selectImage(vm);
    toggleVMButtons(false);
}
function onGroupListClick() {
    let g = (document).getElementById("grp_" + this.name);
    g.click();
    g.onclick();
}

function nothing() {
    console.log("Nothing!");
}

function onGroupClick() {

    let name = getGroupName(this.id);

    let g = findGroup(name);

    //En caso de que sea "All" hay que desactivar las cosas
    toggleGroupButtons((g.index === 0));
    toggleVMButtons(true);

    data.selected_vm = null;
    showGroup(g.o, $("#vm-icons"), [nothing, onVMListClick, onGroupListClick], 4);

}

//Carga la lista de grupos al iniciar la pagina
$(document).ready(function () {
    $("#group-list").empty();
    let all = createGroupItem(data.groups[0], 'active')
    $("#group-list").append(all);
    let allO = (document).getElementById("grp_All");
    allO.onclick = onGroupClick;

    for (let i = 1; i < data.groups.length; i++) {
        let g = createGroupItem(data.groups[i], "");
        $("#group-list").append(g);
        let o = (document).getElementById(g[0].id);
        o.onclick = onGroupClick;
    }
    allO.onclick();
    toggleGroupButtons(true);
    console.log("UN METWO SHINY");
});

/*$(document).ready(function(){
  data.groups.forEach( m =>$("#group-list").onclick(function() {

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

function getChecked(grp, buffer) {
    let i = 0;
    let names = [];
    let nGroups = grp.childGroups.length;
    for (var b of buffer) {
        if (b) {
            if (i < nGroups) {
                names.push(grp.childGroups[i]);
            }
            else {
                let aux_i = i - nGroups;
                names.push(grp.members[aux_i]);
            }
        }
        i++;
    }
    return names;
}

function updateTextFromSelected(grp, buffer, text_id) {
    let str = getChecked(grp, buffer);
    str.join(", ");
    let text = document.getElementById(text_id);
    text.placeholder = str;
}


//Callback cuando se pulsa un item a añadir a un grupo
function onGroupAddClick() {
    let index = 0;
    let group = data.groups[0];
    let nGroups = group.childGroups.length;
    let buffer = data.buffers[ADD_GROUP_ITEMS];

    //Hay que ver si es grupo o vm para hallar su index
    if (findChildGroup(this.name, group)) {
        index = findChildGroup(this.name, group).index;
    }
    else if (findChildVM(this.name, group)) {
        index = nGroups + findChildVM(this.name, group).index;
    }

    //Una vez hallado, simplemente cmabiamos su buffer
    buffer[index] = !buffer[index];
    if (buffer[index]) {
        this.classList.add("edit-selected");
    }
    else {
        this.classList.remove("edit-selected");
    }
    updateTextFromSelected(group, buffer, "new-group-items")
};
//Callback cuando se pulsa un item a añadir a un grupo
function onGroupEditAddClick() {
    let index = 0;
    let group = data.groups[0];
    let nGroups = group.childGroups.length;
    let buffer = data.buffers[0];

    //Hay que ver si es grupo o vm para hallar su index
    if (findChildGroup(this.name, group)) {
        index = findChildGroup(this.name, group).index;
    }
    else if (findChildVM(this.name, group)) {
        index = nGroups + findChildVM(this.name, group).index;
    }

    //Una vez hallado, simplemente cmabiamos su buffer
    buffer[index] = !buffer[index];
    if (buffer[index]) {
        this.classList.add("edit-selected");
    }
    else {
        this.classList.remove("edit-selected");
    }
    updateTextFromSelected(group, buffer, "edit-group-items")
};
function onGroupEditRemoveClick() {
    let index = 0;
    let g = getActiveGroup();
    let grp_name = getGroupName(g.object.id);
    let group = findGroup(grp_name).o; //Grupo en data
    let nGroups = group.childGroups.length;
    let buffer = data.buffers[1];

    //Hay que ver si es grupo o vm para hallar su index
    if (findChildGroup(this.name, group)) {
        index = findChildGroup(this.name, group).index;
    }
    else if (findChildVM(this.name, group)) {
        index = nGroups + findChildVM(this.name, group).index;
    }

    //Una vez hallado, simplemente cmabiamos su buffer
    buffer[index] = !buffer[index];
    if (buffer[index]) {
        this.classList.add("edit-selected");
    }
    else {
        this.classList.remove("edit-selected");
    }
    updateTextFromSelected(group, buffer, "remove-group-items")
};
function initBuffer(group, buffer_index) {
    data.buffers[buffer_index] = [];
    for (let i = 0; i < group.childGroups.length + group.members.length; i++) {
        data.buffers[buffer_index].push(false);
    }
};

$(document).ready(function () {
    //ADD GRUPO
    $(".add-group").click(function () {
        console.log("Añadir Grupo");
        let all = data.groups[0];
        document.getElementById("new-group-name").value = "";
        document.getElementById("new-group-items").placeholder = "";
        //Inicializamos los buffers del los elementos a borrar
        initBuffer(all, ADD_GROUP_ITEMS);
        //Tambien inicializamos las funciones callbacks
        showGroup(all, $("#add-group-items"), onGroupAddClick, 3);
    })

    $("#confirm-add-group").click(function () {
        console.log("Añadir grupo");

        let inputName = document.getElementById("new-group-name").value;
        if (inputName == "" || findGroup(inputName))
            return;

        let c_groups = [];
        let vms = [];
        //Tenemos que separar entre vms y items
        let items = getChecked(data.groups[0], data.buffers[ADD_GROUP_ITEMS]);
        for (var item of items) {
            //Si es un grupo
            if (findGroup(item)) {
                //Lo añadimos a la lista de grupos
                //Y hay que añadir el grupo nuevo como padre
                c_groups.push(item);
                let grp_child = findGroup(item).o;
                grp_child.parents.push(inputName);
            }
            //Si es vm, lo añadimos a las vms
            else if (findVmsById(item)) {
                vms.push(item);
            }
        }
        data.groups.push({ name: inputName, members: vms, parents: ['All'], childGroups: c_groups });
        data.groups[0].childGroups.push(inputName);
        //Refrescar lista
        let g = createGroupItem(data.groups[data.groups.length - 1], "");
        $("#group-list").append(g);
        let o = (document).getElementById(g[0].id);
        o.onclick = onGroupClick;

        getActiveGroup();
        updateHTMLGroups();
        updateActiveGroup();
    });

    // PANTALLA DE ADICION DE UNA VM
    $("#adds").click(function () {
        let name = document.getElementById("add-vm-name");
        name.value = null;
        name.placeholder = "Name...";
        let ram = document.getElementById("add-vm-ram");
        ram.value = null;
        ram.placeholder = "RAM...";
        let hdd = document.getElementById("add-vm-hd");
        hdd.value = null;
        hdd.placeholder = "HD Size..";
        let cpu = document.getElementById("add-vm-cpu");
        cpu.value = null;
        cpu.placeholder = "CPU...";
        let cores = document.getElementById("add-vm-cores");
        cores.value = null;
        cores.placeholder = "Number of cores...";
        let ip = document.getElementById("add-vm-ip");
        ip.value = null;
        ip.placeholder = "IP...";
    })

    //ADD VM
    $("#add-vm").click(function () {
        console.log('Nueva VM');

        let inputName = document.getElementById("add-vm-name").value;
        let inputRam = document.getElementById("add-vm-ram").value;
        let inputHDD = document.getElementById("add-vm-hd").value;
        let inputCPU = document.getElementById("add-vm-cpu").value;
        let inputCores = document.getElementById("add-vm-cores").value;
        //let inputIP = document.getElementById("add-vm-ip").value;

        data.vms.push({ name: inputName, state: "off", ram: inputRam, hdd: inputHDD, cpu: inputCPU, cores: inputCores });
        data.groups[0].members.push(inputName);
        updateHTMLGroups();
        updateActiveGroup();
    });


    //BORRAR GRUPO
    $("#confirm-delete-groups").click(function () {
        //Primero obtenemos el grupo que esta activo y guardamos sus datos
        //(Tanto los del DOM como los de data)
        let g = getActiveGroup(); //Grupo en el DOM
        let grp_name = getGroupName(g.object.id);
        let grp_data = findGroup(grp_name); //Grupo en data
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
        removeGroup(grp_name, grp_data.o);

        updateHTMLGroups();
        updateActiveGroup();
    });

    // BORRAR VM
    $("#confirm-delete-vms").click(function () {
        let vm = getSelectedVM();

        for (let i = 0; i < data.groups.length; i++) {
            let j = 0;
            while (j < data.groups[i].members.length && data.groups[i].members[j] != vm.name) j++;
            if (j < data.groups[i].members.length) data.groups[i].members.splice(j, 1);
        }

        updateActiveGroup();
    })

    // ELIMINAR UNA VM DE UN GRUPO
    $("#confirm-remove-vms").click(function () {
        let vm = getSelectedVM();
        let g = getActiveGroup(); //Grupo en el DOM
        let grp_name = getGroupName(g.object.id);
        let grp_data = findGroup(grp_name); //Grupo en data

        let i = 0;
        while (i < grp_data.o.members.length && grp_data.o.members[i] != vm.name) i++;
        if (i < grp_data.o.members.length) grp_data.o.members.splice(i, 1);

        updateActiveGroup();
    })

    // PANTALLA DE EDICION DE UNA VM
    $("#edit-vm").click(function () {
        let vm = getSelectedVM();
        if (vm != undefined) {
            let name = document.getElementById("edit-vm-name");
            name.value = null;
            name.placeholder = vm.name;
            let ram = document.getElementById("edit-vm-ram");
            ram.value = null;
            ram.placeholder = vm.ram;
            let hdd = document.getElementById("edit-vm-hd");
            hdd.value = null;
            hdd.placeholder = vm.hdd;
            let cpu = document.getElementById("edit-vm-cpu");
            cpu.value = null;
            cpu.placeholder = vm.cpu;
            let cores = document.getElementById("edit-vm-cores");
            cores.value = null;
            cores.placeholder = vm.cores;
            let ip = document.getElementById("edit-vm-ip");
            ip.value = null;
            ip.placeholder = vm.ip;
            let iso = document.getElementById("edit-vm-iso");
            iso.value = null;
            iso.value = vm.iso;
            console.log(name.placeholder);
        }
    })

    // EDITAR UNA VM
    $("#edit-vms").click(function () {
        let vm = getSelectedVM();

        let inputName = document.getElementById("edit-vm-name").value;
        let inputRam = document.getElementById("edit-vm-ram").value;
        let inputHDD = document.getElementById("edit-vm-hd").value;
        let inputCPU = document.getElementById("edit-vm-cpu").value;
        let inputCores = document.getElementById("edit-vm-cores").value;
        let inputIP = document.getElementById("edit-vm-ip").value;

        if (inputName) {
            for (let i = 0; i < data.groups.length; i++) {
                let j = 0;
                while (j < data.groups[i].members.length && data.groups[i].members[j] != vm.name) j++;
                if (j < data.groups[i].members.length) data.groups[i].members[j] = inputName;
            }
            vm.name = inputName;
        }

        if (inputRam) vm.ram = inputRam;
        if (inputHDD) vm.hdd = inputHDD;
        if (inputCPU) vm.cpu = inputCPU;
        if (inputCores) vm.cores = inputCores;
        if (inputIP) vm.ip = inputIP;

        updateActiveGroup();
    })

    $("#edit-group").click(function () {
        let g = getActiveGroup();
        let grp_name = getGroupName(g.object.id);
        let grp_data = findGroup(grp_name).o; //Grupo en data
        let all = data.groups[0];
        console.log("Editar grupo");
        document.getElementById("edit-group-name").placeholder = grp_data.name;
        document.getElementById("edit-group-items").placeholder = "";
        document.getElementById("remove-group-items").placeholder = "";
        //Inicializamos los buffers del los elementos a borrar
        initBuffer(all, EDIT_ADD_ITEMS);
        initBuffer(grp_data, EDIT_RMV_ITEMS);
        //Tambien inicializamos las funciones callbacks
        showGroup(all, $("#add-grp-items"), onGroupEditAddClick, 3);
        showGroup(grp_data, $("#remove-grp-items"), onGroupEditRemoveClick, 3);

    })

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

        if (inputName !== "" && inputName !== grp_data.o.name) {
            changeGroupName(inputName, grp_data.o);
        }

        //Despues borramos los elementos
        let remove_grps = getChecked(grp_data.o, data.buffers[EDIT_RMV_ITEMS]);
        //remove_grps = remove_grps.split(",");
        //Para cada grupo, hay que borrarlo de la lista de hijos de este grupo
        for (var remove_item of remove_grps) {
            if (findGroup(remove_item))
                removeChildGroup(grp_data.o, remove_item);
            else if (findVmsById(remove_item))
                removeChildVM(grp_data.o, remove_item);
        }

        //Despues añadimos los grupos
        let add_grps = getChecked(data.groups[0], data.buffers[EDIT_ADD_ITEMS]);
        //add_grps = add_grps.split(data",");
        for (var add_item of add_grps) {
            if (findGroup(add_item))
                addChildGroup(grp_data.o, add_item);
            else if (findVmsById(add_item))
                addVM(grp_data.o, add_item);
        }

        console.log("Elementos del grupo: " + grp_data.o.childGroups.join(' ') + ' ' + grp_data.o.members.join(' '));
        //Finalmente actualizamos el html
        updateHTMLGroup($(g.object)[0], grp_data.o);
        updateActiveGroup();
    });

    $("#button-play").click(function () {
        //accedemos a la VM seleccionada
        let vm = getSelectedVM();

        if (vm != undefined) {
            //cambiamos su state
            vm.state = "on";

            //cambiamos su imagen
            vm.elem.src = './images/selectedGreenVM.png';
        }
    });

    $("#button-sleep").click(function () {
        //accedemos a la VM seleccionada
        let vm = getSelectedVM();

        if (vm != undefined) {
            //cambiamos su state
            vm.state = "sleep";

            //cambiamos su imagen
            vm.elem.src = './images/selectedYellowVM.png';
        }
    });

    $("#button-off").click(function () {
        //accedemos a la VM seleccionada
        let vm = getSelectedVM();
        if (vm != undefined) {
            //cambiamos su state
            vm.state = "off";

            //cambiamos su imagen
            vm.elem.src = './images/selectedRedVM.png';
        }
    });

});