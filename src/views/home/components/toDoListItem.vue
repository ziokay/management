<style lang="less">
    @import './styles/to-do-list-item.less';
</style>

<template>
    <Row class="to-do-list-item">
        <Col span="2" class="height-100">
            <Row type="flex" justify="center" align="middle" class="height-100">
                <!-- <Checkbox v-model="todoitem"></Checkbox> -->
            </Row>
        </Col>
        <Col span="22" class="height-100">
            <Row type="flex" justify="start" align="middle" class="height-100">
                <p class="to-do-list-item-text" :class="{hasDid: todoitem}" style="margin-right: 10px;">{{ content }}</p>
                <Button type="error" @click="handleHasDid">删除</Button>
            </Row>
        </Col>
    </Row>
</template>

<script>
export default {
    name: 'toDoListItem',
    data () {
        return {
            todoitem: false
        };
    },
    props: {
        content: String
    },
    methods: {
        handleHasDid () {
            this.todoitem = !this.todoitem;
        },

    }
};
</script>