<template>
    <div>
        <div v-if="!nome">
            <div class="c-app flex-row align-items-center">
                <CContainer>
                    <CRow class="justify-content-center">
                        <CCol md="12">
                            <CCard>
                                <CCardBody>
                                    <CForm>
                                        <h1>Seja bem vindo!!</h1>
                                        <p class="text-muted">Entre com Seu Nome</p>
                                        <CInput
                                                v-model="modelName"
                                                placeholder="Seu nome"
                                                autocomplete="username email"
                                        >
                                        </CInput>
                                        <CRow>
                                            <CCol col="6" class="text-left">
                                                <CButton color="primary" class="px-4" @click="logar">Entrar</CButton>
                                            </CCol>
                                        </CRow>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CContainer>
            </div>
        </div>
        <div v-else>
            <h5>Olá {{ nome }}, realize seu pedido!</h5>
            <CButton @click="sair">Sair</CButton>
            <CAlert
                    :show.sync="dismissCountDown"
                    closeButton
                    color="info"
                    v-if="enviado"
            >
                Pedido realizado com sucesso, aguarde ficar pronto para fazer outro...
                <CProgress
                        color="info"
                        :max="30"
                        :value="dismissCountDown"
                        height="4px"
                />
            </CAlert>

            <CAlert color="danger" v-if="error">{{ error }}</CAlert>
            <CCard>
                <CCardHeader>
                    Pedidos Realizados
                </CCardHeader>
                <CCardBody>
                    <CAlert v-for="(ped, index) in pedidos"
                            :key="index" color="info">
                        <p>{{ ped.ingredientes }}</p>
                        <h5>
                            <CBadge :color="ped.status === 3 ? 'success' : 'warning'">{{ status[ped.status] }}</CBadge>
                        </h5>
                    </CAlert>
                </CCardBody>
            </CCard>

            <CCard>
                <CCardHeader>
                    Escolha seus ingredientes
                </CCardHeader>
                <CCardBody>
                    <CRow>
                        <CCol v-for="(opc, index) in opcoes"
                              col="6" sm="4" md="2" xl class="mb-3 mb-xl-0"
                              :key="index">
                            <CButton color="primary"
                                     block
                                     size="lg"
                                     variant="outline"
                                     :pressed="opc.selected"
                                     @click="select(opc, index)"
                            >
                                {{ opc.name }}
                            </CButton>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

            <CCard>
                <CCardHeader>
                    Ingredientes selecionados
                </CCardHeader>
                <CCardBody>
                    <CButtonGroup v-for="(opc, index) in opcoes" :key="index" class="m-2">
                        <div v-if="opc.selected">
                            <CButton
                                    variant="outline"
                                    disabled
                                    color="success"
                                    size="lg">
                                {{ opc.name }}
                            </CButton>
                            <CButton
                                    color="danger"
                                    size="lg"
                                    @click="opc.selected = false">
                                <CIcon name="cil-trash"/>
                            </CButton>
                        </div>
                    </CButtonGroup>
                    <CButton v-if="count >= 1"
                             block
                             size="lg"
                             color="success"
                             @click="realiza">
                        Realizar Pedido
                    </CButton>
                </CCardBody>
            </CCard>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'Dashboard',

        data() {
            return {
                error: null,
                nome: null,
                modelName: null,
                pedidos: [],
                enviado: false,
                opcoes: [
                    {name: 'Mussarela', selected: false},
                    {name: 'Calabresa', selected: false},
                    {name: 'Banana', selected: false},
                    {name: 'Tomate', selected: false},
                    {name: 'Cebola', selected: false},
                    {name: 'Açucar', selected: false},
                    {name: 'Canela', selected: false},
                    {name: 'Frango', selected: false},
                    {name: 'Chocolate', selected: false},
                ],
                dismissCountDown: 30,
                status: {
                    1: 'Novo',
                    2: 'Em preparação',
                    3: 'Pronto'
                },
            }
        },

        computed: {
            count: function () {
                return this.opcoes.filter((obj) => obj.selected === true).length;
            },
        },
        mounted() {
            if (localStorage.getItem('nome')) {
                this.nome = localStorage.getItem('nome');
            }
            if (this.nome) {
                this.getPedidos();
                setInterval(() => {
                    this.getPedidos();
                }, 5000);
            }

        },
        methods: {
            select: function (item, index) {
                this.opcoes[index].selected = !this.opcoes[index].selected;
            },
            realiza: function () {
                this.$http.post('http://192.168.0.103:3333/pedido',
                    {
                        nome: this.nome,
                        ingredientes: this.getIngredientes().toString(),
                        status: 1
                    })
                    .then(() => {
                        this.enviado = true;
                        this.getPedidos();
                        this.opcoes = this.opcoes.map((item) => {
                            return {name: item.name, selected: false}
                        })
                        window.scrollTo(0, 0);
                    })
                    .catch(error => {
                        this.error = error;
                    });
            },

            getPedidos: function () {
                this.$http.get(`http://192.168.0.103:3333/pedido/${this.nome}`)
                    .then((response) => {
                        localStorage.setItem('pedidos', response.data)
                        this.pedidos = response.data
                    })
            },
            getIngredientes: function () {
                return this.opcoes.filter((obj) => obj.selected === true).map((item) => {
                    return item.name
                })
            },
            logar: function () {
                localStorage.setItem('nome', this.modelName);
                this.nome = this.modelName;
            },
            sair: function () {
                localStorage.clear();
                this.nome = null;
                this.modelName = null;
            },
        },
    }
</script>
