//Valores de ingreso y egreso iniciales a modo de ejemplo.
const ingresos = [
    //new Ingreso('Sueldo', 5800.00),
    //new Ingreso('sueldo 2', 9000.00)
];

const egresos = [
    //new Egreso('Supermercado', 250.00),
    //new Egreso('Auto Shop', 1500.00)   
]

let cargarApp = () =>{
    cargarCabecero();
    cargarIngresos();
    cargarEgresos();
}

let totalIngresos = () =>{
    let totalIngreso = 0;
    for (let ingreso of ingresos){
        totalIngreso += ingreso.valor
    }
    return totalIngreso;
}

let totalEgresos = () =>{
    let totalEgreso = 0;
    for (let egreso of egresos){
        totalEgreso += egreso.valor
    }
    return totalEgreso;
}

//Actualiza los valores del cabecero cada vez que se hace un cambio
let cargarCabecero = () =>{
    let presupuesto = totalIngresos() - totalEgresos();
    let porcentajeEgreso = totalEgresos() / totalIngresos();
    document.getElementById('presupuesto').innerHTML = formatoMoneda(presupuesto);
    document.getElementById('porcentaje').innerHTML = formatoPorcentaje(porcentajeEgreso);
    document.getElementById('ingresos').innerHTML = formatoMoneda(totalIngresos());
    document.getElementById('egresos').innerHTML = formatoMoneda(totalEgresos());
}

//Formato de moneda
const formatoMoneda = (valor) =>{
    return valor.toLocaleString('en-US',{style:'currency', currency:'USD', minimuFractionDigits:2});
}
//Formato porcentaje
const formatoPorcentaje = (valor) =>{
    return valor.toLocaleString('en-US',{style:'percent', minimuFractionDigits: 2})
}


//Cargar y mostrar ingresos
const cargarIngresos = () =>{
    let ingresoHTML = '';

    for(let ingreso of ingresos){
        ingresoHTML += crearIngresoHTML(ingreso);
    }
    document.getElementById('lista-ingresos').innerHTML = ingresoHTML;
}

const crearIngresoHTML = (ingreso)=> {
    let ingresoHTML =`
    <div id="lista-ingresos">
                <div class="elemento limpiarEstilos">
                    <div class="elemento_descripcion">${ingreso.descripcion}</div>
                    <div class="derecha limpiarEstilos">
                        <div class="elemento_valor">${formatoMoneda(ingreso.valor)}</div>
                        <div class="elemento_eliminar">
                            <button class="elemento_eliminar--btn">
                                <ion-icon name="close-circle-outline"
                                 onclick= 'eliminarIngreso(${ingreso.id})'></ion-icon>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `;
    return ingresoHTML
}

const eliminarIngreso = (id) =>{
    //Encontramos el indice dentro de la lista con el id del objeto
    let indiceEliminar =  ingresos.findIndex(ingreso =>ingreso.id === id);
    //La funcion splice elimina de la lista los elementos segun su indice y cantidad necesaria
    ingresos.splice(indiceEliminar, 1);
    //Actualizamos informacion en pantalla
    cargarCabecero();
    cargarIngresos(); 
}

//Cargar y mostrar dinamicamente egresos

const cargarEgresos = () =>{
    let egresosHTML = '';

    for(let egreso of egresos){
        egresosHTML += crearEgresoHTML(egreso);
    }
    document.getElementById('lista-egresos').innerHTML = egresosHTML;
}

const crearEgresoHTML = (egreso)=>{

    let egresoHTML=`  
        <div class="elemento limpiarEstilos">
                    <div class="elemento_descripcion">${egreso.descripcion}</div>
                    <div class="derecha limpiarEstilos">
                        <div class="elemento_valor">-${formatoMoneda(egreso.valor)}</div>
                        <div class="elemento_porcentaje">${formatoPorcentaje(egreso.valor / totalEgresos())}</div>
                        <div class="elemento_eliminar">
                            <button class="elemento_eliminar--btn">
                                <ion-icon name="close-circle-outline"
                                onclick= 'eliminarEgreso(${egreso.id})'></ion-icon>
                            </button>
                        </div>
                    </div>
                </div>`;
    return egresoHTML
}

let reiniciarApp = () => {
    ingresos.splice(0, ingresos.length)
    egresos.splice(0, egresos.length);
    cargarCabecero();
    cargarEgresos();
    cargarIngresos();
}

const eliminarEgreso = (id) =>{
    let indiceEliminar =  egresos.findIndex(egreso =>egreso.id === id);
    egresos.splice(indiceEliminar, 1);
    cargarCabecero();
    cargarIngresos();
    cargarEgresos(); 
}

let agregarDato = () =>{
    let forma = document.forms['forma'];
    let tipo = forma['tipo'];
    let descripcion = forma['descripcion'];
    let valor = forma['valor'];

    if(descripcion.value !=='' && valor.value !==''){
        if(tipo.value ==='ingreso'){
            ingresos.push(new Ingreso(descripcion.value, Number(valor.value)));
            cargarCabecero();
            cargarIngresos();
        }
        else if(tipo.value ==='egreso'){
            egresos.push(new Egreso(descripcion.value, Number(valor.value)));
            cargarCabecero();
            cargarEgresos();
        }
    }
}