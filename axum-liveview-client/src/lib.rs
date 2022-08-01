#![forbid(future_incompatible, unsafe_code)]
#![warn(
    missing_docs,
    missing_debug_implementations,
    nonstandard_style,
    rust_2018_idioms,
    unreachable_pub
)]
#![feature(
    associated_type_defaults,
    never_type,
    trait_alias,
    backtrace,
    once_cell,
    doc_auto_cfg,
    fn_traits,
    unboxed_closures
)]
#![recursion_limit = "1024"]
#![doc = include_str!("../README.md")]

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc<'static> = wee_alloc::WeeAlloc::INIT;

pub mod prelude;

use crate::prelude::*;

/// Library initialization.
#[wasm_bindgen]
pub fn setup() -> Result<Unit> {
    console_error_panic_hook::set_once();
    tracing_wasm::set_as_global_default();
    Ok(())
}
