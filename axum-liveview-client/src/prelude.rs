//! Library prelude

#![allow(unused_imports)]

pub(crate) use axum_liveview_core::prelude::*;
pub(crate) use wasm_bindgen::{
    prelude::*,
    JsCast,
};

/// A convenience alias for a result with a [JsValue] as an error type.
pub type JsResult<T> = StdResult<T, JsValue>;

/// A convienience alias for a result with a [JsError] as an error type.
pub type Result<T, E = JsError> = StdResult<T, E>;
