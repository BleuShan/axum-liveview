//! Core library prelude

#![allow(unused_imports)]

pub use async_trait::async_trait;

pub use derive_more::{
    AsMut,
    AsRef,
    Deref,
    DerefMut,
    Display,
    From,
    FromStr,
    Index,
    IndexMut,
    Into,
    IntoIterator,
    IsVariant,
    TryInto,
};
pub use futures::{
    self,
    prelude::*,
};
pub use regex::{
    self,
    Error as RegexError,
    Regex,
};
pub use std::{
    backtrace::Backtrace,
    convert::{
        AsMut,
        AsRef,
        TryFrom,
    },
    error::Error as StdError,
    fmt::{
        self,
        Debug,
        Display,
    },
    io::{
        Error as IOError,
        ErrorKind as IOErrorKind,
    },
    ops::{
        Deref,
        DerefMut,
        Index,
        IndexMut,
    },
    result::Result as StdResult,
    str::FromStr,
};
pub use thiserror::Error;
pub use tracing::{
    self,
    debug,
    error,
    info,
    instrument,
    trace,
    warn,
};
pub use tracing_appender;
pub use tracing_subscriber;

/// An alias for the `()` type. Used to get a more uniform syntax.
pub type Unit = ();

/// An alias for Send + Sync
pub trait SendSync = Send + Sync;
