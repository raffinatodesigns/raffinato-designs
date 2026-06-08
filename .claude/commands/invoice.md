Generate an invoice for a client. Ask me for any missing details:

- Client name and email
- Invoice number (or auto-increment from last one in /Finance)
- Line items (service description + amount)
- Due date
- Any deposit already paid

Output a clean invoice in markdown with:

- Raffinato Designs header (business name, minobilio@gmail.com)
- Invoice # and date
- Bill To section
- Itemized table: Description | Qty | Rate | Amount
- Subtotal, any discount, total due
- Payment instructions placeholder
- "Thank you for your business" footer

Also save the file to /Finance/invoices/invoice-[number]-[client].md
