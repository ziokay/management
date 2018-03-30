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
            title: '饭桌订单',
            initStatus: 1
        };
    }
};
</script>
