#![forbid(future_incompatible, unsafe_code)]
#![warn(
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

mod logging;
mod prelude;

use crate::prelude::*;

#[tokio::main]
#[instrument]
async fn main() -> Result<Unit> {
    let _guard = logging::init()?;
    info!("Hello, world!");

    Ok(())
}
