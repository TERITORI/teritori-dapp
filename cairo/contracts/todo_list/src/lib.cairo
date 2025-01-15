#[derive(Drop, Serde, Copy)]
pub struct Todo {
    pub title: felt252,
    pub done: bool,
}

#[starknet::interface]
pub trait ITodoList<TContractState> {
    fn add_todo(ref self: TContractState, title: felt252);
    fn set_todo_done(ref self: TContractState, index: u64);
    fn get_todos(self: @TContractState) -> Array<Todo>;
}

#[starknet::contract]
mod TodoList {
    use core::starknet::storage::{
        StoragePointerWriteAccess, StoragePointerReadAccess, VecTrait, MutableVecTrait, Vec,
    };
    use super::Todo;

    #[storage]
    struct Storage {
        todos_title: Vec<felt252>,
    }

    #[abi(embed_v0)]
    impl TodoListImpl of super::ITodoList<ContractState> {
        fn add_todo(ref self: ContractState, title: felt252) {
            assert(title != '', 'Title cannot be empty');

            self.todos_title.append().write(title);
            self.todos_done.append().write(false);
        }

        fn set_todo_done(ref self: ContractState, index: u64) {
            // assert(index < self.todos_title.len(), 'Index out of bounds');

            self.todos_done.at(index).write(true);
        }

        fn get_todos(self: @ContractState) -> Array<Todo> {
            let mut result = ArrayTrait::new();

            for i in 0..self.todos_title.len() {
                let title = self.todos_title.at(i).read();
                let done = self.todos_done.at(i).read();
                result.append(Todo { title, done });
            };

            result
        }
    }
}
