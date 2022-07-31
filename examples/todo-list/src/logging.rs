use crate::prelude::*;

use std::io::stderr;
use tracing_appender::{
    non_blocking,
    non_blocking::WorkerGuard,
};
use tracing_subscriber::fmt;

pub(crate) fn init() -> Result<WorkerGuard> {
    color_eyre::install()?;
    let (writer, guard) = non_blocking(stderr());
    fmt().pretty().with_writer(writer).init();
    Ok(guard)
}
