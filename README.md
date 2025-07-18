
## Deskripsi Proyek
Proyek ini adalah implementasi halaman daftar "Ideas" (artikel/post) pada Suitmedia. Halaman ini menampilkan daftar post yang diambil dari API, dilengkapi dengan fitur-fitur interaktif seperti sorting, pagination, dan efek visual pada header serta banner.

## Cara Menjalankan Proyek Secara Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan pengembangan lokal Anda:

1.  **Clone Repositori:**
    ```bash
    git clone github.com/ramdhini/Suitmedia-Project
    cd Suitmedia-Project
    ```
2.  **Instal Dependensi:**
    ```bash
    npm install
    ```
3.  **Pastikan Aset Lokal Ada:**
    * Pastikan file logo Anda (`logo.png`) ada di `src/assets/`.
    * Pastikan file gambar banner Anda (`bannerheader.png`) ada di `src/assets/`.
      
4.  **Mulai Server Pengembangan:**
    ```bash
    npm start
    ```
    Proyek akan terbuka di browser Anda (biasanya di `http://localhost:3000`).

## Deployment

Proyek ini di-deploy menggunakan Netlify.

-   **URL Deployment:** [[suitmedia-project.netlify.app](https://suitmedia-project.netlify.app/)]

## Struktur Proyek

Suitmedia-Project/
├── config/
│   ├── webpack.common.js
│   ├── webpack.dev.js
│   └── webpack.prod.js
├── dist/                     # Hasil build Webpack
├── node_modules/
├── src/
│   ├── assets/               # Aset gambar lokal (logo, banner)
│   │   ├── logo.png
│   │   └── bannerheader.png
│   ├── index.html            # Template HTML utama
│   ├── index.js              # JavaScript utama (entry point)
│   └── style.css             # CSS global
├── package.json              
├── package-lock.json         
└── README.md                 
