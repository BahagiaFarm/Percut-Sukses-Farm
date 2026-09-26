document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
        { id: 1, name: 'Ayam', img: '1.jpg', price: 40000 },
        { id: 2, name: 'Telur', img: '2.jpg', price: 20000 },
    ],

  }));

 Alpine.store('cart', {
   items: [],
   total: 0,
   quantity: 0,
   add(newItem) {
    // cek apakah ada barang yang sama di cart
    const cartItem = this.items.find((item) => item.id === newItem.id);

    // jika belum ada / cart masih kosong
    if(!cartItem) {
        this.items.push({...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
    } else {
        // jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
        this.items = this.items.map((item) => {
          // barang beda
          if(item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada, tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        })
    }
   },
   remove(id) {
    // ambil item yang mau diremove berdasarkan id nya
    const cartItem = this.items.find((item) => item.id === id );

    // jika item lebih dari 1
    if(cartItem.quantity > 1) {
        // telusuri satu per satu
        this.items = this.items.map((item) => {
        // jika bukan barang yang diklik
        if(item.id !== id) {
            return item;
        } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price
            return item;
        }
        })
    } else if (cartItem.quantity === 1) {
      // jika brangnya sisa 1
      this.items = this.items.filter((item) => item.id !== id);
      this.quantity--;
      this.total -= cartItem.price;
    }
   },

 });

});

// Form Validation
const chekoutButton = document.querySelector('.chekout-button');
chekoutButton.disabled = true;

const form = document.querySelector('#chekoutForm');
form.addEventListener('keyup', function() {
for (let i = 0; i< form.elements.length; i++) {
    if(form.elements[i].value.length !== 0) {
      chekoutButton.classList.remove('disabled');
      chekoutButton.classList.add('disabled');
    } else {
        return false;
    }
}
chekoutButton.disabled = false;
chekoutButton.classList.remove('disabled');
});

// kirim data ketika tombol chekout diklik
chekoutButton.addEventListener('click', function(e) {
e.preventDefault();
const formData = new FormData(form);
const data = new URLSearchParams(formData);
const objData = Object.fromEntries(data);
const message = formatMessage(objData);
console.log(objData);
});

// format pesan whatsapp
const formatMessage = (obj) => {
    return `Data Customer
    Nama: ${obj.name}
    Email: ${obj.email}
    No HP: ${obj.phone}
Data Pesanan
${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupaih(item.total)}) \n`)}
TOTAL: ${rupiah(obj.total)}
Terima kasih.`;
};


// Konversi ke Rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style:'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

