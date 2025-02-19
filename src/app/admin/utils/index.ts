import {FormGroup} from "@angular/forms";
import {Vehicle} from "../interfaces";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const TAUX =130.0189;
export  function  setupAutoCalculations(form:FormGroup) {
  // Calculate totalKm
  form.get('endKm')?.valueChanges.subscribe(() => {
    const startKm = form.get('startKm')?.value || 0;
    const endKm = form.get('endKm')?.value || 0;
    const totalKm = Math.max(endKm - startKm, 0);
    form.get('totalKm')?.setValue(totalKm, { emitEvent: false });
    calculateCostPerKm(form);
  });

  form.get('startKm')?.valueChanges.subscribe(() => {
    const startKm = form.get('startKm')?.value || 0;
    const endKm =  form.get('endKm')?.value || 0;
    const totalKm = Math.max(endKm - startKm, 0);
   form.get('totalKm')?.setValue(totalKm, { emitEvent: false });
   calculateCostPerKm(form);
  });

  // Calculate totalFuelCost
  form.get('fuelQuantityGallons')?.valueChanges.subscribe(() =>{
   calculateTotalFuelCost(form)
   calculateConsumptionPer100Km(form)
  });
 form.get('pricePerGallon')?.valueChanges.subscribe(() =>{
    calculateTotalFuelCost(form)
     calculateConsumptionPer100Km(form)
  });


   form.valueChanges.subscribe(() => calculateTotalCost(form));
}

export function  calculateTotalFuelCost(form:FormGroup) {
  const fuelQuantityGallons = form.get('fuelQuantityGallons')?.value || 0;
  const pricePerGallon =  form.get('pricePerGallon')?.value || 0;
  const totalFuelCost = fuelQuantityGallons * pricePerGallon;
  form.get('totalFuelCost')?.setValue(formatMoney(totalFuelCost), { emitEvent: false });
 calculateTotalCost(form);
}

export function  calculateTotalCost(form:FormGroup) {
  const rentalCost = Number(form.get('rentalCost')?.value) || 0;
  const maintenanceCost = Number(form.get('maintenanceCost')?.value) || 0;
  const repairCost = Number(form.get('repairCost')?.value) || 0;
  const insuranceCost = Number(form.get('insuranceCost')?.value) || 0;
  // const totalFuelCost = Number(form.get('totalFuelCost')?.value) || 0;

  const totalFuelCost = Number(
    form.get('totalFuelCost')?.value.toString().replace(/\s/g, '').replace(',', '.') || 0
  )
  const totalCost = rentalCost + maintenanceCost + repairCost + insuranceCost + totalFuelCost;



  form.get('totalCost')?.setValue(formatMoney(totalCost), { emitEvent: false })
  form.get('estimatedCostUSD')?.setValue(formatMoney(totalCost/TAUX), { emitEvent: false });
 form.get('estimatedCostHTG')?.setValue( form.get('totalCost')?.value.toString().replace(/\s/g, '').replace(',', '.') || 0), { emitEvent: false };

calculateCostPerKm(form);

}



export function calculateCostPerKm(form: FormGroup) {
  // Clean and convert the totalCost value to a number
  const totalCost = Number(
    form.get('totalCost')?.value.toString().replace(/\s/g, '').replace(',', '.') || 0
  );

  // Get totalKm with fallback to 1 to avoid division by zero
  const totalKm = Number(form.get('totalKm')?.value || 1);

  // Calculate the cost per km
  const costPerKm = totalKm > 0 ? totalCost / totalKm : 0;

  // Set the cost per km in the form, using formatted money value
  form.get('costPerKm')?.setValue(formatMoney(costPerKm), { emitEvent: false });
}


export function  calculateConsumptionPer100Km(form:FormGroup){

  const  result =  (Number(form.get('fuelQuantityGallons')?.value) * 100)/ Number(form.get('totalKm')?.value)  ;
  form.get('consumptionPer100Km')?.setValue(result, { emitEvent: false });
}


function formatMoney(amount: number, locale: string = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function parseFormattedNumber(value: string | number): number {
  if (value === undefined || value === null) {
    return 0;  // or return NaN if you prefer
  }

  if (typeof value === "number") return value; // Already a number

  return parseFloat(value.replace(/\s/g, '').replace(',', '.')); // Removes spaces and converts comma to dot
}


export  function exportToPDF( vehicle:Vehicle) {
  console.log(vehicle.consumptionReports)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
// Image URL (relative to the public folder)
  const imageUrl = 'data:image/png;base64,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';

// Set image size and position
  const imgWidth = 50;
  const imgHeight = 20;
  const imgX = (pageWidth - imgWidth) / 2;
  const imgY = margin + 5;

// Add the image to the PDF
  doc.addImage(imageUrl, 'png', imgX, 2, imgWidth, imgHeight);
  doc.setFontSize(24);
  doc.setTextColor(44, 62, 80);



  // Title
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80);
  doc.text(`${vehicle.brand} ${vehicle.model} - Rapport de Consommation `, pageWidth / 2, imgY + 12, {align: 'center'});

  // Header box
  const headerBoxY = margin + 20;
  const headerBoxHeight = 40;
  doc.setDrawColor(230, 230, 230);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(margin, headerBoxY, pageWidth - (margin * 2), headerBoxHeight, 3, 3, 'FD');

  // Vehicle code and plate
  doc.setFontSize(16);
  doc.setTextColor(70, 70, 70);
  doc.text(`${vehicle.zlCode} - ${vehicle.plate}`, margin + 30, headerBoxY + 15);

  // Badges
  const badgeY = headerBoxY + 20;
  // 4x4 badge
  doc.setFillColor(0, 123, 255);
  doc.roundedRect(margin + 10, badgeY, 15, 8, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(` ${vehicle.category}`, margin + 13, badgeY + 5.5);

  // TOYOTA badge
  doc.setFillColor(108, 117, 125);
  doc.roundedRect(margin + 30, badgeY, 25, 8, 2, 2, 'F');
  doc.text(` ${vehicle.brand}`, margin + 33, badgeY + 5.5);

  // Vehicle details on the right
  const detailsX = pageWidth - margin - 120;
  doc.setFontSize(12);
  doc.setTextColor(70, 70, 70);
  doc.text(`Site: ${vehicle.site}`, detailsX, headerBoxY + 15);
  doc.text(`Owner: ${vehicle.owner}`, detailsX, headerBoxY + 25);

  const yearX = pageWidth - margin - 60;
  doc.text(`Year: ${vehicle.year}`, yearX, headerBoxY + 15);
  doc.text(`First Use: ${vehicle.firstUseYear}`, yearX, headerBoxY + 25);

  // Calculate totals
  const totals = vehicle.consumptionReports.reduce((acc, report) => ({
    totalKm: acc.totalKm + report.totalKm,
    totalFuelQuantity: acc.totalFuelQuantity + report.fuelQuantityGallons,
    totalFuelCost: acc.totalFuelCost + report.totalFuelCost,
    totalRentalCost: acc.totalRentalCost + report.rentalCost,
    totalMaintenanceCost: acc.totalMaintenanceCost + report.maintenanceCost,
    totalInsuranceCost: acc.totalInsuranceCost + report.insuranceCost,
    totalCostHTG: acc.totalCostHTG + report.estimatedCostHTG,
    totalCostUSD: acc.totalCostUSD + report.estimatedCostUSD,
  }), {
    totalKm: 0,
    totalFuelQuantity: 0,
    totalFuelCost: 0,
    totalRentalCost: 0,
    totalMaintenanceCost: 0,
    totalInsuranceCost: 0,
    totalCostHTG: 0,
    totalCostUSD: 0,
  });

  // Consumption Reports Table
  autoTable(doc, {
    startY: headerBoxY + headerBoxHeight + 10,
    head: [[
      {content: 'Date', styles: {halign: 'left'}},
      {content: 'Distance (KM)', styles: {halign: 'left'}},
      {content: 'Carburant', styles: {halign: 'left'}},
      {content: 'Consommation', styles: {halign: 'left'}},
      {content: 'Coûts (HTG)', styles: {halign: 'left'}},
      {content: 'Total', styles: {halign: 'right'}}
    ]],
    body: vehicle.consumptionReports.map(report => [
      new Date(report.reportDate).toLocaleDateString(),
      {
        content: [
          `Départ: ${report.startKm.toLocaleString()}`,
          `Arrivée: ${report.endKm.toLocaleString()}`,
          `Total: ${report.totalKm.toLocaleString()}`
        ].join('\n'),
        styles: {cellWidth: 35}
      },
      {
        content: [
          `Type: ${report.fuelType}`,
          `Quantité: ${report.fuelQuantityGallons.toLocaleString()} gal`,
          `Prix: ${report.pricePerGallon.toLocaleString()} ${report.currency}/gal`
        ].join('\n'),
        styles: {cellWidth: 45}
      },
      {
        content: [
          `${report.consumptionPer100Km.toLocaleString()} L/100km`,
          `${report.costPerKm.toLocaleString(undefined, {minimumFractionDigits: 2})} ${report.currency}/km`
        ].join('\n'),
        styles: {cellWidth: 35}
      },
      {
        content: [
          `Carburant: ${report.totalFuelCost.toLocaleString()}`,
          `Location: ${report.rentalCost.toLocaleString()}`,
          `Entretien: ${report.maintenanceCost.toLocaleString()}`,
          `Assur.: ${report.insuranceCost.toLocaleString()}`
        ].join('\n'),
        styles: {cellWidth: 45}
      },
      {
        content: [
          `HTG: ${report.estimatedCostHTG.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
          `USD: ${report.estimatedCostUSD.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
            `TAUX: ${report.rate?.rate.toLocaleString(undefined, {minimumFractionDigits: 2})}`
        ].join('\n'),
        styles: {halign: 'right', fontStyle: 'bold'}
      }
    ]),
    foot: [[
      {
        content: 'TOTAUX',
        styles: {halign: 'left', fontStyle: 'bold'}
      },
      {
        content: `${totals.totalKm.toLocaleString()} KM`,
        styles: {halign: 'left', fontStyle: 'bold'}
      },
      {
        content: `${totals.totalFuelQuantity.toLocaleString()} gal`,
        styles: {halign: 'left', fontStyle: 'bold'}
      },
      {content: ''},
      {
        content: [
          `Carburant: ${totals.totalFuelCost.toLocaleString()}`,
          `Location: ${totals.totalRentalCost.toLocaleString()}`,
          `Entretien: ${totals.totalMaintenanceCost.toLocaleString()}`,
          `Assur.: ${totals.totalInsuranceCost.toLocaleString()}`
        ].join('\n'),
        styles: {fontStyle: 'bold'}
      },
      {
        content: [
          `HTG: ${totals.totalCostHTG.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
          `USD: ${totals.totalCostUSD.toLocaleString(undefined, {minimumFractionDigits: 2})}`
        ].join('\n'),
        styles: {halign: 'right', fontStyle: 'bold'}
      }
    ]],
    theme: 'grid',
    headStyles: {
      fillColor: [248, 249, 250],
      textColor: [33, 37, 41],
      fontSize: 10,
      fontStyle: 'bold',
      cellPadding: 6
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 5,
      lineColor: [233, 236, 239]
    },
    footStyles: {
      fillColor: [248, 249, 250],
      textColor: [33, 37, 41],
      fontSize: 10,
      fontStyle: 'bold',
      cellPadding: 6
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    margin: {left: margin, right: margin},
  });


  // Add page number and generation date
  const pageCount = (doc as any).internal.pages.length;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 5,
      {align: 'center'}
    );
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      margin,
      pageHeight - 5
    );
  }

  // Save the PDF
  doc.save(`${vehicle.zlCode}-${vehicle.plate}-consumption-report.pdf`);
}
