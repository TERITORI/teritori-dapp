#[macro_export]
macro_rules! field {
    ($a:expr, $b:expr) => {
        Field {
            name: $a.to_string(),
            new_value: $b.to_string(),
            old_value: $b.to_string(), // Do not need this value:  $c.to_string(),
        }
    };
}
