<template>
    <div>
        <PageView :title="title" :status="initStatus"></PageView>
    </div>
</template>

<script>
import PageView from './components/view';
export default {
    name: 'table-review',
    components: {
        PageView
    },
    data () {
        return {
            title: '商家审核',
            initStatus: 0
        };
    }
};
</script>
