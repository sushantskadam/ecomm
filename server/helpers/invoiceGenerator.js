const fs = require('fs');
const PDFDocument=require('pdfkit')
var datetime = new Date();
module.exports=function createInvoice(invoice, path) {
	let doc = new PDFDocument({ margin: 50 });

	generateHeader(doc,invoice);
	generateCustomerInformation(doc, invoice);
	generateInvoiceTable(doc, invoice);
	// generateFooter(doc);
    //console.log(doc)
    console.log(path)
	doc.end();
	doc.pipe(fs.createWriteStream(path));
}
var data1=0
function generateHeader(doc,invoice) {
	// const shipping = invoice.shipping;
	
		
	doc.image(`${__dirname}/logo.jpg`, 50, 45, { width: 50 })
		.fillColor('#444444')
		.fontSize(20)
		.text(`NeoStore`, 110, 57)
		.fontSize(10)
		// .text(`${invoice.sendername}`, 200, 50, { align: 'right' })
		// .text(`${invoice.senderemail}`, 200, 65, { align: 'right' })
		// .text(`${invoice.address.address}`, 200, 80, { align: 'right' })
		.text(`STATUS: Unpaid`, 200, 80, { align: 'right' })
		.text(`Invoice Date: ${datetime}`, 200, 95, { align: 'right' })
		.moveDown();
}

function generateCustomerInformation(doc, invoice) {


	doc.text(`Invoice Number: ${Math.round(Math.random()* 100000)}`, 50, 200)
		// .text(`Invoice Date: ${invoice.invoicedate}`, 50, 215)
		.text(`TO : `, 50, 130)

		.text(`Name: ${invoice.user.fname} ${invoice.user.lname}`)
		.text(`Address: ${invoice.address.address} ${invoice.address.city} ${invoice.address.pincode}, ${invoice.address.state}, ${invoice.address.country}`)
		// .text(`STATUS: Unpaid`, 200, 130, { align: 'right' })
		// .text(`Invoice Date: ${datetime}`, 200, 142, { align: 'right' })
		// .text(`Due Date: ${invoice.duedate}`, 200, 154, { align: 'right' })
		.text(`TOTAL AMOUNT: ${invoice.total}`, 200, 500, { align: 'right' })
		.fontSize(10)
		.moveDown();
}
function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
	data1=y
	doc.fontSize(10)
		.text(c1, 50, y)
		.text(c2, 360, y)
		.text(c3, 400, y, { width: 90, align: 'right' })
		.text(c4, 470, y, { width: 90, align: 'right' })
		.text(c5, 0, y, { align: 'right' });
}
function generateInvoiceTable(doc, invoice) {
	let i,
		invoiceTableTop = 230;
        generateTableRow(
			doc,
			invoiceTableTop,
			"Product Name",
			"Product Price",
			"Quantity",
			// "Discount %",
            "Total",
		);
	for (i = 0; i < invoice.cartitems.length; i++) {
		const item = invoice.cartitems[i];
		const position = invoiceTableTop + (i + 1) * 30;
		generateTableRow(
			doc,
			position,
			item.product_name,
			item.product_cost,
			item.quantity,
			// item.discount,
            item.product_cost * item.quantity
		);
	}
}
function generateFooter(doc) {
	doc.fontSize(
		10,
	).text(
		'Payment is due within 15 days. Thank you for your business.',
		50,
		data1+80,
		{ align: 'center', width: 500 },
	);
}