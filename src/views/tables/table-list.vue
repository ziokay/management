<template>
    <div>
        <PageView :status="initStatus"></PageView>
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
            initStatus: 0
        };
    }
};
</script>
