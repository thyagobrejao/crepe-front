<template>
    <div>
        <h3>Pedidos</h3>
        <table class="table table-bordered table-striped">
            <tbody>
            <tr v-for="(ped, index) in pedidos" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ ped.nome }}</td>
                <td>{{ ped.ingredientes }}</td>
                <td>
                    <CBadge :color="ped.status === 3 ? 'success' : 'warning'">{{ status[ped.status] }}</CBadge>
                </td>
                <td>
                    <CButtonGroup>
                        <CButton color="primary" @click="changeStatus(1, ped.id, ped.nome)">Novo</CButton>
                        <CButton color="warning" @click="changeStatus(2, ped.id, ped.nome)">Em preparação</CButton>
                        <CButton color="success" @click="changeStatus(3, ped.id, ped.nome)">Pronto</CButton>
                        <CButton color="danger" @click="remove(ped.id)">Apagar</CButton>
                    </CButtonGroup>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: 'Pedidos',

        data() {
            return {
                pedidos: [],
                status: {
                    1: 'Novo',
                    2: 'Em preparação',
                    3: 'Pronto'
                },
            }
        },
        mounted() {
            this.getPedidos();
            setInterval(() => {
                this.getPedidos();
            }, 5000);
        },
        methods: {
            getPedidos: function () {
                this.$http.get(`http://192.168.0.103:3333/pedido`)
                    .then((response) => {
                        this.pedidos = response.data
                    })
            },
            changeStatus: function (status, id, nome) {
                this.$http.put(`http://192.168.0.103:3333/pedido/${id}`,
                    {status: status})
                    .then(() => {
                        if (status === 3) {
                            var msg = new SpeechSynthesisUtterance(`Atenção ${nome}, seu crepe está pronto, pode vir buscar!`);
                            window.speechSynthesis.speak(msg);
                        }
                        this.getPedidos()
                    })
            },

            remove: function (id) {
                this.$http.delete(`http://192.168.0.103:3333/pedido/${id}`)
                    .then(() => {
                        this.getPedidos()
                    })
            }
        }
    }
</script>
