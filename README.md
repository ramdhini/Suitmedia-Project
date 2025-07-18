
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

Suitmedia-Project/ <br>
├── config/ <br>
│   ├── webpack.common.js <br>
│   ├── webpack.dev.js <br>
│   └── webpack.prod.js <br>
├── dist/                     # Hasil build Webpack <br>
├── node_modules/ <br>
├── src/ <br>
│   ├── assets/               # Aset gambar lokal (logo, banner) <br>
│   │   ├── logo.png <br>
│   │   └── bannerheader.png <br>
│   ├── index.html            # Template HTML utama <br>
│   ├── index.js              # JavaScript utama (entry point) <br>
│   └── style.css             # CSS global <br>
├── package.json              <br>
├── package-lock.json         <br>
└── README.md                 <br>
