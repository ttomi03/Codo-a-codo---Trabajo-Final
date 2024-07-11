const { createApp } = Vue;
createApp({
    data() {
        return {
            usuarios: [],
            url: 'https://ttomi03.pythonanywhere.com/usuarios',
            error: false,
            cargando: true,
            usuario: "",
            clave: "",
            rol: 0
        };
    },
    methods: {
        async fetchData(url) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                this.usuarios = data;
                this.cargando = false;
                console.log(this.usuarios);
            } catch (err) {
                console.error('Error fetching data:', err);
                this.error = true;
                this.cargando = false;
            }
        },
        async grabar() {
            const usuario = {
                usuario: this.usuario,
                clave: this.clave,
                rol: this.rol
            };
            try {
                const response = await fetch(this.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(usuario)
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                this.usuarios.push(data);
                alert('Registro grabado');
                window.location.href = "./login.html";
            } catch (err) {
                console.error('Error al grabar:', err);
                alert('Error al grabar');
            }
        },
        login() {
            const usuario = this.usuario;
            sessionStorage.setItem("adm", 0);
            let i = 0;
            while (i < this.usuarios.length && this.usuarios[i].usuario !== usuario) {
                i++;
            }
            if (i < this.usuarios.length) {
                if (this.usuarios[i].clave === this.clave) {
                    if (this.usuarios[i].rol === 1) {
                        sessionStorage.setItem("adm", 1);
                        window.location.href = "./productos2.html";
                    } else {
                        window.location.href = "./index.html";
                    }
                } else {
                    alert('Clave errónea');
                }
            } else {
                alert('Usuario erróneo');
            }
        },
        async eliminar(id) {
            try {
                const response = await fetch(this.url + '/' + id, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
                    alert('Usuario eliminado');
                } else {
                    alert('Error al intentar eliminar el usuario');
                }
            } catch (err) {
                console.error('Error al eliminar el usuario:', err);
                alert('Error al intentar eliminar el usuario');
            }
        },
        async hacerAdmin(id) {
            try {
                const usuario = this.usuarios.find(user => user.id === id);
                if (!usuario) {
                    throw new Error('Usuario no encontrado');
                }
                usuario.rol = 1;  

                const response = await fetch(this.url + '/' + id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(usuario)
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                alert('Usuario ahora es admin');
            } catch (err) {
                console.error('Error al hacer admin:', err);
                alert('Error al intentar hacer admin');
            }
        }
    },
    created() {
        this.fetchData(this.url);
    },
}).mount('#app');