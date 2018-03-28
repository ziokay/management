<template>
    <div>
        <PageView :title="title" :status="initStatus"></PageView>
    </div>
</template>

<script>
import PageView from './components/view';
export default {
    name: 'table-list',
    components: {
        PageView
    },
    data () {
        return {
            title: '商家列表',
            initStatus: 1
        };
    }
};
</script>
