//Valores de ingreso y egreso iniciales a modo de ejemplo.
const ingresos = [
    new Ingreso('Sueldo', 5800.00),
    new Ingreso('sueldo 2', 9000.00)
];

const egresos = [
    new Egreso('Supermercado', 250.00),
    new Egreso('Auto Shop', 1500.00)   
]

let cargarApp = () =>{
    cargarCabecero();
    cargarIngresos();
    cargarEgresos();
    actualizarGrafico();
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
    actualizarGrafico(); 
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

const eliminarEgreso = (id) =>{
    let indiceEliminar =  egresos.findIndex(egreso =>egreso.id === id);
    egresos.splice(indiceEliminar, 1);
    cargarCabecero();
    cargarEgresos();
    actualizarGrafico(); 
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
            actualizarGrafico();
        }
        else if(tipo.value ==='egreso'){
            egresos.push(new Egreso(descripcion.value, Number(valor.value)));
            cargarCabecero();
            cargarEgresos();
            actualizarGrafico();
        }
    }
}

//actualizar grafico
let grafico = null;

function actualizarGrafico() {
    const ctx = document.getElementById('graficoPresupuesto').getContext('2d');

    const datos = {
        labels: ['Ingresos', 'Egresos'],
        datasets: [{
            label: 'Presupuesto',
            data: [totalIngresos(), totalEgresos()],
            backgroundColor: ['#28B9B5', '#FF5049']
        }]
    };

    const opciones = {
        responsive: true,
        plugins: {
            legend: {
                display: true
            }
        }
    };

    // Destruir el gráfico anterior si existe
    if (grafico) {
        grafico.destroy();
    }

    grafico = new Chart(ctx, {
        type: 'bar',
        data: datos,
        options: opciones
    });

}

//exportar a excel
function exportarAExcel() {
    const wb = XLSX.utils.book_new();
    
    // Ingresos
    const datosIngresos = ingresos.map(ing => ({
        Descripción: ing.descripcion,
        Valor: ing.valor
    }));
    const hojaIngresos = XLSX.utils.json_to_sheet(datosIngresos);
    XLSX.utils.book_append_sheet(wb, hojaIngresos, "Ingresos");
    
    // Egresos
    const datosEgresos = egresos.map(egr => ({
        Descripción: egr.descripcion,
        Valor: egr.valor
    }));
    const hojaEgresos = XLSX.utils.json_to_sheet(datosEgresos);
    XLSX.utils.book_append_sheet(wb, hojaEgresos, "Egresos");
    
    // Guardar archivo
    XLSX.writeFile(wb, "presupuesto.xlsx");
}

//exportar pdf
function exportarAPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Ingresos
    doc.text("Ingresos", 10, 10);
    doc.autoTable({
        head: [["Descripción", "Valor"]],
        body: ingresos.map(ing => [ing.descripcion, formatoMoneda(ing.valor)]),
        startY: 15
    });
    
    // Egresos
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.text("Egresos", 10, finalY);
    doc.autoTable({
        head: [["Descripción", "Valor"]],
        body: egresos.map(egr => [egr.descripcion, formatoMoneda(egr.valor)]),
        startY: finalY + 5
    });
    
    doc.save("presupuesto.pdf");
}
    
    
