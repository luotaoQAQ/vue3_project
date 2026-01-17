# vite
    vite是新一代前端构建工具，前端构建工具用的最多的是webpack，vite的优势如下：
        1.轻量快速的热重载(HMR)，能实现极速的服务启动
        2.对TS，JSX，CSS等开箱即用
        3.真正的按需编译，不再等待整个应用编译完成
        
        vite创建vue3工程步骤：
            npm create vue@latest
        
        入口文件：
            webpack的入口文件是main.js/ts
            vite的入口文件是index.html

# 选项式API和组合式API
    Vue2的API设计是Options(配置)风格的
        数据、方法、计算属性等是分散在data、methods、computed中的，若想新增或修改一个需求，就需要分别修改data、methods、computed，不便于维护和复用
    Vue3的API设计是Composition(组合)风格的
        可以用函数的方式，更加优雅的组织代码，让相关功能的代码更加有序的组织在一起

# setup
    1.setup执行的时机比beforeCreate更早
    2.setup里面没有维护this，是undefined，Vue3中已经开始弱化this
    3.数据，原来写在data中的
        let name = '张三'
        let age = 18
        let tel = '13551560010' // 这样写，数据不是响应式的
    4.将数据、方法返回出去，模板才能使用
        return {name, age, changeName, changeAge, showTel}
    5.setup和data、methods能同时存在，而且data、methods旧写法能读取到setup里面的数据，因为它们能用this。但setup却不能读取旧写法中的数据。
        所以在Vue3中不建议setup和data、methods一起写
    6.setup语法糖
        <script setup lang="ts"></script>
        setup单独写在一个新的script标签里面，带有setup，会自动return。
        注意：两个script标签的语言必须相同
        
        所以Vue3里面有两个script标签非常正常，但是写两个有点麻烦，特别是其中一个只有name属性时，它的作用只是给组件取名。这时我们借助一个插件npm i vite-plugin-vue-setup-extend -D，在vite.config.ts中引入并调用这个插件：
        import vueSetupExtend from 'vite-plugin-vue-setup-extend'
        
        export default defineConfig({
        plugins: [
            vue(),
            vueDevTools(),
            vueSetupExtend(),
        ]
        })
        此时只需要一个script标签<script setup lang="ts" name="Person123"></script>

# ref
    1.ref创建基本类型的响应式数据：
        需要是响应式的就用ref包裹，比如这里的name和age修改过了，需要是响应式，而tel和address只是做展示，不需要是响应式。

	    包裹后成了一个RefImpl{xxx}对象，在setup中需要.value去取RefImpl对象中的值。

	    在模板中{{ name }}不需要.value，会自动去取。

    2.ref创建对象类型的响应数据：
        表面上ref创建了对象类型的响应数据，实际上ref.value调用了reactive去帮它实现了对象类型的响应数据
    
# reactive
    reactive只能创建对象类型的响应式数据：
        和ref一样把需要响应式的对象用reactive包裹起来，成了一个Proxy(Object/Array){xxx}对象。

        这里包裹的可以是对象也可以是数组，且响应式都是深层次的

# ref和reactive对比
    ref：
        1.用来定义基本类型、对象类型数据
        2.ref创建的变量必须使用.value(可以使用volar插件自动添加.value:settings->extensions->Vue › Auto Insert: Dot Value这个勾选上)

    reactive：
        1.对象类型数据
        2.reactive重新分配一个新对象，会失去响应式(可以使用Object.assign去整体替换)

    使用原则：
        1.基本类型响应数据，必须使用ref
        2.对象类型响应数据，层级不深，ref和reactive都可以
        3.层级深，推荐使用reacitve

# toRefs和toRef
    一般解构赋值：
        let person = reactive({
            name: '张三',
            age: 18
        })

        let {name, age} = person
        这样相当于：
        let name = person.name
        let age = person.age

        当你去修改name和age时，是不会修改person.name和person.age的，而页面只有它俩修改才会触发响应式渲染

    但可以使用toRefs：
        let {name, age} = toRefs(person)
        这样name和age也是响应式的了，包裹成了RefImpl{xxx}对象，而且你修改name和age也会将person里面对应的属性一起修改了

    toRef是一个一个取，而toRefs是全部：
        let nianling = toRef(person, 'age')

# computed计算属性
    这么定义的计算属性是只读的，不可以修改：
        let fullName = computed(() => {
            return firstName.value.slice(0,1).toUpperCase() + firstName.value.slice(1) + '-' + lastName.value;
        })

         function changeFullName(){
            fullName.value = 'li-si' 
        }

        会报错：Cannot assign to 'value' because it is a read-only property.
        这和Vue2里面一样，computed有简写形式，就是写出函数，但前提条件是只读不改，如果要修改就必须写成对象形式

        let fullName = computed({
            get(){
                return firstName.value.slice(0,1).toUpperCase() + firstName.value.slice(1) + '-' + lastName.value;
            },
            set(val){
                const [str1, str2] = val.split('-');
                firstName.value = str1!;
                lastName.value = str2!;
            }
        })

        这样就能修改了
        注意：计算属性是一个ref包裹的RefImpl{xxx}对象

# watch
    作用：监视数据的变化

    特点：Vue3中的watch只能监视以下4种数据：
        1.ref
        2.reactive
        3.一个函数，返回一个值(getter函数)
        4.一个包含上述内容的数组

    情况：
        1.监视ref定义的基本类型数据，直接写数据名即可，监视的是其value值的改变:
            const stopWatch = watch(sum, (newVal, oldVal) => {
                console.log('sum变化了', newVal, oldVal);
                if(newVal >= 10){
                    stopWatch()
                }
            })

        2.监视ref定义的对象类型数据，直接写数据名即可，监视的是对象的【地址值】，若想监视对象内部的数据，要手动开启深度监视：
            注意：如果修改的是对象中的属性，newVal和oldVal都是新值，因为它们是同一个对象
                  如果修改的是整个对象，newVal是新值，oldVal是旧值，因为不是同一个对象了

            三个参数：watch(被监视的数据，回调函数，配置对象)

        3.监视reactive定义的对象类型数据，且默认开启深度监视，且关不掉：
            person.value = {name: '李四', age: 100}
                真真正正改变了地址值
            Object.assign(person1, {name: '李四', age: 100})
                没有改变地址值，只能说批量修改了对象中的属性，对象还是那个对象

        4.监视ref或reactive定义的对象类型数据中的【某个属性】：
            1.若该属性值不是对象类型，需要写成函数形式
            2.若该属性值依旧是对象类型，可直接编，也可以写成函数，不过【建议写成函数】
                (1)监视person2里面的car，直接person2.car：
                    c1，c2改变(修改对象中的属性值)都能监听，但全部车改变(也就是整个对象改变)没法监听

                    当你直接监听 person2.car 时：
                        实际上监听的是 reactive({ c1: '奥迪 R8', c2: '特斯拉 Model Y' }) 这个响应式对象
                        Vue 会追踪这个对象内部属性的变化

                watch(person2.car, (newVal, oldVal) => {
                    console.log('person2里面的car改变了', newVal, oldVal);
                })

                (2)监视person2里面的car，加工成一个getter函数：
                    c1，c2改变(修改对象中的属性值)没法监听，但全部车改变(也就是整个对象改变)可以监听

                    getter 函数返回的是 car 的当前值，每次执行这个函数，都返回 person2.car 的当前值
                    如果 person2.car 指向了新的对象，返回值就会变化

                    【要想两个都监听到，开启深度监视】

                watch(() => person2.car, (newVal, oldVal) => {
                    console.log('person2里面的car改变了', newVal, oldVal);
                }, {deep: true})

        5.监视上述多个属性：
            监视数据写成数组，且newVal和oldVal也是数组
            watch([() => person2.name, () => person2.car], (newVal, oldVal) => {
                // 这里newVal和oldVal也是数组
                console.log('person2里面的name或car改变了', newVal, oldVal);
            }, {deep: true})

# watchEffect
    立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行该函数

    watch和watchEffect对比：
        1.都能监听响应式数据的变化，不同的是监听数据变化的方式不同
            watch：要明确指出监视的数据
            watchEffect：不用明确指出监视的数据(函数中用到哪些属性，那就监视哪些属性)

# 标签的ref属性
    1.可以用在普通html标签上，因为传统id需要document.getElementById('title')才能拿到DOM，而且如果id有冲突，拿到的是优先渲染的DOM
    而ref没有这个缺陷，在App里面有ref='title2'的标签，Person里面也有，它们拿到的都是自己组件里面的DOM：
        let title2 = ref()
        console.log(title2.value)

    2.可以用在组件标签上：
        <Person ref="ren"></Person>
        console.log(ren.value);
        这时候输出的确实是Person的实例对象，但是里面的数据都被保护起来了，要想看到数据需要在组件中使用defineExpose：
            defineExpose 是 Vue 3 <script setup> 中的一个编译器宏，不需要手动导入
            在最后：defineExpose({a, b, c})，把你想要暴露的数据放进去
            这时console.log(ren.value) ==> Proxy(Object) {a: RefImpl, b: RefImpl, c: RefImpl, __v_skip: true}就有数据了

# 接口、泛型、自定义接口
    在src下创建types文件夹下的index.ts文件，在里面定义接口：

        // 定义一个接口，用于限制person对象的具体属性
        export interface PersonInter {
            // 类型都是小写
            readonly id: string, // readonly 表示只读属性
            name: string, // 必须有 name 属性
            age: number, // 必须有 age 属性
            gender?: string    // ? 表示可选属性
        }

        // 一个自定义类型,使用 type 关键字给现有类型起别名或创建新的类型组合
        // export type Persons = Array<PersonInter>
        export type Persons = PersonInter[]

    在组件内引入并使用：
        import {type PersonInter, type Persons} from '@/types'

        let person: PersonInter = {id: 'asfbjkasfkjsabkbaka', name: '张三', age: 60}

        let personList:Array<PersonInter> = [
            {id: 'asfbjkasfkjsabkbaka', name: '张三', age: 60},
            {id: 'bsfbjkasfksyahjkaka', name: '李四', age: 50},
            {id: 'csfbjasfsfsaybkbaka', name: '王五', age: 40},
        ]

        let personList:Persons = [
            {id: 'asfbjkasfkjsabkbaka', name: '张三', age: 60},
            {id: 'bsfbjkasfksyahjkaka', name: '李四', age: 50},
            {id: 'csfbjasfsfsaybkbaka', name: '王五', age: 40}
        ]

# props
    defineProps 是 Vue 3 <script setup> 中的一个编译器宏，不需要手动导入

    父组件给子组件传props和Vue2类似：
        <Person :list="personList" a="你好" b="尚硅谷"></Person>

    子组件接收props：
        defineProps(['a', 'b', 'personList'])

        这个函数会返回一个对象：Proxy(Object) {personList: Proxy(Array), a: '1', b: '2'}，可以声明变量去接受
        let x = defineProps(['a', 'b', 'list'])

        接收+限制类型+限制必要性(?)+指定默认值(要用到withDefaults)：
        withDefaults(defineProps<{list?:Persons, a?:string, b?:string}>(), {
            list: () => [{id: 'bsfbjkasfksugjshvka', name: '刘真宇', age: 22}],
            a: 'hello',
            b: 'atguigu'
        })

# Vue3生命周期函数
    1.创建：
        Vue3中没有beforeCreate和created，被setup取代

    2.挂载：
        挂载前：onBeforeMount(() => {})

        挂载完毕：onMounted(() => {})

    3.更新：
        onBeforeUpdate(() => {})

        onUpdated(() => {})

    4.卸载：
        onBeforeUnmount(() => {})

        onUnmounted(() => {})

    注意：是子组件先挂载完毕，父组件后挂载完毕

# 自定义Hooks
    在src下创建hooks文件夹，里面的文件命名通常是useXyyy.ts，比如useDog.ts：

        import { reactive } from 'vue'
        import axios from 'axios'

        export default function () {
            let dogList = reactive([
                "https://images.dog.ceo/breeds/pembroke/n02113023_5848.jpg"
            ])

            async function addDog() {
                try {
                    let result = await axios.get('https://dog.ceo/api/breed/pembroke/images/random')
                    dogList.push(result.data.message)
                } catch (error) {
                    alert(error)
                }
            }

            // 向外部提供东西
            return {dogList, addDog}
        }

    然后在组件里面引入并调用暴露的函数：

        import useDog from '@/hooks/useDog'

        const {dogList, addDog} = useDog()

    注意：hooks里面还能写生命周期函数

# 路由
    1.安装：npm i vue-router

    2.引入路由构造器：
        Vue2：import VueRouter from "vue-router";

        Vue3：import {createRouter} from 'vue-router'

    3.引入路由组件：
        import Home from '@/components/Home.vue'
        import News from '@/components/News.vue'
        import About from '@/components/About.vue'

    4.创建并暴露路由器：
        注意工作模式：
            Vue2：
                mode: 'hash'或者'history'，可以不配置默认是hash模式

            Vue3：
                history: createWebHashHistory()或着createWebHistory()，分别对应hash或者history模式
                Vue3里面必须配置工作模式，不能不写，否则会报错

        const router = createRouter({
            history: createWebHashHistory(),
            routes: [
                {
                    path: '/home',
                    component: Home
                },
                {
                    path: '/news',
                    component: News
                },
                {
                    path: '/about',
                    component: About
                }
            ]
        })

        export default router

    5.在main.ts里面引入并使用路由器：
        // 引入路由器
        import router from './router'

        const app = createApp(App);

        // 使用路由器
        app.use(router)

        // 挂载整个应该到app容器中
        app.mount('#app')

    6.在组件里引入RouterView和RouterLink(也可以不引入，直接用router-link和router-view)，后面路由的用法和Vue2差不多：
        (1)也有命名路由
        (2)也有嵌套路由
        (3)query参数：
            to有两种写法：(1)字符串   (2)对象
            注意要想取到query等参数需要引入并调用useRoute函数，创建route对象：
                import { useRoute } from 'vue-router';
                let route = useRoute()
        (4)params参数：
            to有两种写法：(1)字符串   (2)对象：对象形式时不能用path，只能用name，而且params参数值不能是数组或对象
            当有些参数可传可不传时，用?：path: 'detail/:id/:title/:content?'
        (5)props配置：
            a.props的第一种写法象，值为对象，该对象中所有key-value的组合会以props的形式传给Detail组件
            props:{a:1,b:'hello'}

            b.props的第二种写法，值为布尔值，若布尔值为真，就会组件收到的所有params参数以props的形式传给Detail组件
            props:true

            c.props的第三种写法，值为函数，该函数返回的对象中每一组key-value都会通过props传给Detail组件
            props(route){
                return {
                    id:route.query.id,
                    title:route.query.title
                }
            }
        (6)replace属性：
            默认是push模式，在router-link标签上写上replace(简写，相当于:replace="true")，就变成replace模式
                <RouterLink replace :to="{name: 'xinwen'}" active-class="ikun">新闻</RouterLink>
        (7)编程式路由：
            router-link最后转化成<a>标签，但有些时候我们希望点击按钮跳转，这时就不能使用router-link
            这时我们需要引入并调用useRouter函数，创建router对象：
                import { useRouter } from 'vue-router';
                const router = useRouter()

            然后去调用router上的push或replace方法：
                router.replace({
                    name: 'xiangqing',
                    query: {
                        id: news.id,
                        title: news.title,
                        content: news.content
                    }
                })

# 重定向
    我们没有给'/'配置路由规则，控制台会有警告： [Vue Router warn]: No match found for location with path "/"
    所以我们也要给'/'配置路由规则，让它重定向到主页'/home'：
    {
        path: '/',
        redirect: '/home'
    }

# pinia
    集中式状态(数据)管理：
        Vue2：vuex
        Vue3：pinia     安装：npm i pinia

        1.引入，创建并使用pinia：
            import { createPinia } from 'pinia';
            const pinia = createPinia();
            app.use(pinia);

        2.创建store文件夹，不同的数据存储在不同的ts文件下：
            import { defineStore } from "pinia";

            export const useCountStore = defineStore('count', {
                // 真正存储数据的地方
                state(){
                    return {
                        sum: 6
                    }
                }
            })
        
        3.在组件内引入并读取数据：
            import { useCountStore } from '@/store/count';
            let countStore = useCountStore();
            以下两种都能拿到state中的数据:
                countStore.sum(推荐)  或者    countStore.$state.sum
                注意：如果是reactive里面的ref，取值时就不用.value了。
                这里countStore是reactive响应式对象，里面的sum是ref响应式数据，而输出不用countStore.sum.value

        4.修改数据(三种方式)：
            (1)第一种修改方式，直接修改：
                countStore.sum += n.value
                vuex里面是不允许这样直接修改数据的，只有通过mutations才能操作state里面的数据

            (2)第二种修改方式，批量修改：
                countStore.$patch({
                    school: '尚硅谷',
                    address: '四川省雅安市雨城区'
                })

            (3)第三种修改方式，actions方法：
                配置对象里面加上一个actions对象：
                    // 放置的是方法，用于响应组件中的“动作”
                    actions: {
                        increment(value){
                            console.log(this);
                            // 维护好了一个this指向当前的store
                            this.sum += value
                        }
                    },

                组件里调用actions中的方法，有参传参：
                    countStore.increment(n.value)

        5.读取数据(storeToRefs)：
            读取countStore的数据总要加上前缀：countStore.sum、countStore.school、countStore.address，太麻烦
            我们可以解构赋值，但注意不要丢失响应式：
                {sum, school, address} = toRefs(countStore)

                但不建议这么做，因为toRefs把countStore上面所有的属性(包括方法)都变成ref响应式，而我们只需要将三个数据包裹一下
                {sum, school, address} = storeToRefs(countStore)

        6.getters：
            getters: {
                bigSum(state){
                    return state.sum * 10
                },
                upperSchool(){
                    // 也可以不接受state参数，维护好了一个this指向当前store
                    return this.school.toUpperCase()
                }
            }

            getters中的数据也可以通过storeToRefs获取到：
                let {sum, school, address, bigSum, upperSchool} = storeToRefs(countStore)

        7.$subscribe：
            通过store的$subscribe()方法侦听state及其变化：
                talkStore.$subscribe((mutate, state) => {
                    console.log('talkStore里面的数据发生了变化', mutate, state);
                    localStorage.setItem('talkList', JSON.stringify(state.talkList))
                })

        8.store的组合式写法：
            defineStore的第二个参数不写成对象，而是写成箭头函数

            import { reactive } from "vue";

            export const useTalkStore = defineStore('talk', () => {
                // talkList就是state
                const talkList = reactive(JSON.parse(localStorage.getItem('talkList')) || [])

                // getATalk函数相当于action
                async function getATalk() {
                    try {
                        let result = await axios.get('https://api.zxki.cn/api/twqh')
                        let obj = { id: nanoid(), title: result.data }
                        talkList.unshift(obj)
                    } catch (error) {
                        alert(error.message)
                    }
                }
                return {talkList, getATalk}
            })

# 组件间通信
    1.props
    2.自定义事件：
        给子组件Child绑定事件
        <Child @send-toy="saveToy"/>

        在子组件里声明事件
        const emit =  defineEmits(['send-toy'])

        <button @click="emit('send-toy',toy)">测试</button>
    
    3.mitt实现任意组件间通信：
        安装：npm i mitt，创建utils文件夹下的emitter.ts文件：
            // 引入mitt
            import mitt from 'mitt'

            // 调用mitt得到emitter，emitter能：绑定事件、触发事件
            const emitter = mitt()

            // 暴露emitter
            export default emitter

        谁接收数据，谁绑定事件：
            // 给emitter绑定send-toy事件
            emitter.on('send-toy',(value:any)=>{
                toy.value = value
            })
        谁发送数据，谁触发事件：
            <button @click="emitter.emit('send-toy',toy)">玩具给弟弟</button>

    4.v-model：
        v-model用在html标签上：
            <input type="text" v-model="username"> 双向绑定相当于下面单向绑定+input事件

            <input type="text" :value="username" @input="username = (<HTMLInputElement>$event.target).value">
        
        v-model用在组件标签上：
            <AtguiguInput v-model="username"/> 相当于

            <AtguiguInput :modelValue="username" @update:modelValue="username = $event"/>
                注意：$event对于原生事件，可以.target，得到事件对象
                        对于自定义事件，不能.target，$event就是触发事件时传递的值

        AtguiguInput子组件接收：
            defineProps(['modelValue'])
            const emit = defineEmits(['update:modelValue'])

            <input 
                type="text" 
                :value="modelValue"
                @input="emit('update:modelValue',(<HTMLInputElement>$event.target).value)"
            >

    5.$attrs实现祖->孙通信：
        父组件里传递了4个值：
            <Child :a="a" :b="b" :c="c" :d="d"/>
        子组件里只声明了1个props：
            defineProps(['a'])
            其余的b、c、d也没有丢弃，借助开发者工具可以看到它们保存在$attrs中

        所以，实现祖->孙通信，中间子一个props都不声明，直接把$attrs传给孙：
            <GrandChild v-bind="$attrs"/>
            在孙组件里defineProps(['a','b','c','d','x','y','updateA'])

    6.$refs和$parent
        $refs：父->子
            我们通过ref代替id给子组件打上唯一标识，$refs是一个对象，里面包含当前组件所有包含ref的子组件实例对象
            具体来说是key-value对，比如：
                <Child1 ref="c1"/>
		        <Child2 ref="c2"/>

                打印出来是：
                    c1: Proxy(Object) {toy: RefImpl, book: RefImpl, __v_skip: true}
                    c2: Proxy(Object) {computer: RefImpl, book: RefImpl, __v_skip: true}

                可以通过for in循环遍历$refs：
                    function getAllChild(refs:{[key:string]:any}){
                        for (let key in refs){
                            refs[key].book += 3
                        }
                    }
        $parent：子->父
            因为对任何一个子组件来说，父组件只有一个，所有不用变量，$parent就是父组件实例对象：
                Proxy(Object) {house: RefImpl, __v_skip: true}

        注意：数据默认都是保护起来的，要想看到数据需要对外暴露defineExpose({xxx, yyy})

    7.provide-inject实现祖孙之间通信：
        provide(数据名字, 数据的值)，父组件向后代提供数据：
            import { provide } from 'vue'

            // 注意这里money是ref响应类型，不要.value，否则就是取具体值传给后代，这样后代拿到的数据就不是响应式的
            provide('moneyContext',{money, updateMoney}) 
            provide('car',car)

        inject(数据名字, 默认值)：
            import { inject } from "vue";

            let {money,updateMoney} = inject('moneyContext',{ money:0,updateMoney:(param:number)=>{} })
            let car = inject('car',{brand:'未知',price:0})

        相比$attrs中间实际上还是需要子组件v-bind="$attrs"，这里provide-inject完全不需要打扰子组件

    8.pinia

    9.默认插槽

    10.具名插槽：
        普通标签：slot="xxx"
        template和组件标签：v-slot:xxx -> 简写形式：#xxx

        <slot name="xxx"></slot>

    11.作用域插槽：
        数据在组件的自身，但根据数据生成的结构需要组件的使用者来决定（games数据在Game组件中，但使用数据所遍历出来的结构由Father组件决定）
        在Game组件中：
            <slot :youxi="games" x="哈哈" y="你好"></slot>

        在Father组件中：
            <Game>
                <template v-slot="params">
                <ul>
                    <li v-for="y in params.youxi" :key="y.id">
                        {{ y.name }}
                    </li>
                </ul>
                </template>
            </Game>

            <Game>
                <template #default="{youxi}">
                <ol>
                    <li v-for="y in youxi" :key="y.id">
                        {{ y.name }}
                    </li>
                </ol>
                </template>
            </Game>

            注意：vue2中使用的是scope或者slot-scope
                    而vue3中统一使用v-slot:xxx="params"或者简写形式#xxx="params"
                    如果是default则：v-slot="params" 和 #default="params"

# shallowRef和shallowReactive
    shallowRef：
        创建一个响应式数据，但只对顶层属性进行响应式处理。
        作用：
            当对象的属性很多，且对象里面嵌套着对象，这样如果用ref，那里面所有属性都要设置为响应式，导致性能降低
            如果我们只关心对象有没有整个被替换，这时我们就可以使用shallowRef，其中深层的属性不是响应式的，效率高

    shallowReactive：
        创建一个浅层响应式对象，只会使对象的最顶层属性变成响应式的，作用和上面类似

    总结：绕开深度响应，使得属性访问变得更快，可提升性能   

# readonly和shallowReadonly
    readonly：
        所有层次都是只读的
        import { readonly, ref } from 'vue';

        let sum1 = ref(0)

        let sum2 = readonly(sum1)

        function changeSum1(){
            sum1.value += 1
        }

        function changeSum2(){
            // 警告：Cannot assign to 'value' because it is a read-only property.
            sum2.value += 1 // 不起作用
        }

    shallowReadonly：
        顶层属性是只读的，深层次还是可以修改的

# toRaw和markRaw
    toRaw：
        用于获取一个响应式对象的原始对象，返回的对象不再是响应式的，不会触发视图更新。
        可以用于临时读取而不引起代理访问/跟踪开销，或是写入而不触发更改的特殊方法，不
        建议保存对原始对象的持久引用。
        何时使用？——在需要将响应式对象传递给非Vue的库或外部系统时，使用toRaw可以确保
        它们收到的是普通对象

        import { reactive, toRaw } from 'vue';

        let person = reactive({
            name: 'tony',
            age: 18
        })

        let person2 = toRaw(person)

        console.log('响应式数据', person); // Proxy(Object) {name: 'tony', age: 18}
        // 不再是响应式的了
        console.log('原始数据', person2); // {name: 'tony', age: 18}

    markRaw：
        标记一个对象，使其永远不会变成响应式的
        何时使用？——在使用第三方库时，为了防止把引入的第三方库对象变成响应式的，用markRaw去标记

        let car = markRaw({brand: '奔驰', price: 100})
        let car2 = reactive(car)

        console.log(car);
        console.log(car2); // 没有变成响应式

# customRef
    创建一个自定义的ref，并对其依赖项跟踪和更新触发进行逻辑控制：
        import { ref, customRef } from 'vue';

        // 使用Vue提供的默认ref定义响应式数据，数据一变，页面就更新
        // let msg = ref('你好')

        // 需求：数据一变，等2s页面再变
        let initValue = '你好'
        let timer
        // track跟踪，trigger触发
        let msg = customRef((track, trigger) => {
            return {
                get(){
                    // msg被读取时调用
                    track() // 告诉Vue数据msg很重要，你要对msg进行持续关注，一旦msg变化就去更新
                    return initValue
                },
                set(value){
                    clearTimeout(timer)
                    // msg被修改时调用
                    timer = setTimeout(() => {
                        initValue = value
                        trigger() // 通知Vue一下数据msg变化了
                    }, 1000)
                }
            }
        })

# Teleport
    是一种能够将我们的组件html结构移动到指定位置的技术
        <teleport to='body'>
            <div class="model" v-show="isShow">
                <h2>我是弹窗的标题</h2>
                <p>我是弹出的内容</p>
                <button @click="isShow = false">关闭弹窗</button>
            </div>
        </teleport>
    这时Model组件里面的弹窗的代码，如果不加teleport，这个div最终编译后是在App组件最外层div.outer里面，
    但加了teleport，to里面的是选择器，编译后div.model就会移动到指定位置
    使用场景：弹窗我们希望依照视口进行定位，但弹窗父亲或祖先元素有开启定位的，不好依照body进行定位

# Suspense
    等待异步组件时渲染一些额外的内容，让用户有更好的体验
    使用场景：子组件里面包含异步任务(网络请求),但用的setup语法糖，而不是setup()函数，也就不能加async，这样会导致子组件无法加载

    我们需要在父组件中使用Suspense，他的基本原理是插槽：
        <Suspense>
			<template v-slot:default>
				<Child></Child>
			</template>
			<template v-slot:fallback>
				<h2>加载中...</h2>
			</template>
		</Suspense>
        当异步任务还未完成时显示<h2>加载中...</h2>，而异步任务完成后显示<Child></Child>

# 全局API转移到应用对象上
    Vue2在Vue上的API，现在全在app上：
        app.component
        app.config:
            原来Vue2：Vue.prototype.xxx = 999
            现在Vue3：app.config.globalProperties.x = 999
        app.directive
        app.mount
        app.unmount
        app.use

# Vue3非兼容性改变
    查看官网：https://v3-migration.vuejs.org/zh/breaking-changes/transition.html
    比如：
        1.过渡的 class 名更改: 过渡类名 v-enter 修改为 v-enter-from、过渡类名 v-leave 修改为 v-leave-from
        2.不再支持使用数字 (即键码) 作为 v-on 修饰符，不再支持 config.keyCodes：
            <!-- 键码版本 -->
            <input v-on:keyup.13="submit" />

            <!-- 别名版本 -->
            <input v-on:keyup.enter="submit" />
        3.v-model 指令在组件上的使用已经被重新设计，替换掉了 v-bind.sync
        4.v-if 和 v-for 在同一个元素身上使用时的优先级发生了变化：
            两者作用于同一个元素上时，v-if 会拥有比 v-for 更高的优先级。
