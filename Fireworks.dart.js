//  ********** Library dart:core **************
//  ********** Natives dart:core **************
function $defProp(obj, prop, value) {
  Object.defineProperty(obj, prop,
      {value: value, enumerable: false, writable: true, configurable: true});
}
$defProp(Object.prototype, '$typeNameOf', (function() {
  function constructorNameWithFallback(obj) {
    var constructor = obj.constructor;
    if (typeof(constructor) == 'function') {
      // The constructor isn't null or undefined at this point. Try
      // to grab hold of its name.
      var name = constructor.name;
      // If the name is a non-empty string, we use that as the type
      // name of this object. On Firefox, we often get 'Object' as
      // the constructor name even for more specialized objects so
      // we have to fall through to the toString() based implementation
      // below in that case.
      if (typeof(name) == 'string' && name && name != 'Object') return name;
    }
    var string = Object.prototype.toString.call(obj);
    return string.substring(8, string.length - 1);
  }

  function chrome$typeNameOf() {
    var name = this.constructor.name;
    if (name == 'Window') return 'DOMWindow';
    return name;
  }

  function firefox$typeNameOf() {
    var name = constructorNameWithFallback(this);
    if (name == 'Window') return 'DOMWindow';
    if (name == 'Document') return 'HTMLDocument';
    if (name == 'XMLDocument') return 'Document';
    return name;
  }

  function ie$typeNameOf() {
    var name = constructorNameWithFallback(this);
    if (name == 'Window') return 'DOMWindow';
    // IE calls both HTML and XML documents 'Document', so we check for the
    // xmlVersion property, which is the empty string on HTML documents.
    if (name == 'Document' && this.xmlVersion) return 'Document';
    if (name == 'Document') return 'HTMLDocument';
    return name;
  }

  // If we're not in the browser, we're almost certainly running on v8.
  if (typeof(navigator) != 'object') return chrome$typeNameOf;

  var userAgent = navigator.userAgent;
  if (/Chrome|DumpRenderTree/.test(userAgent)) return chrome$typeNameOf;
  if (/Firefox/.test(userAgent)) return firefox$typeNameOf;
  if (/MSIE/.test(userAgent)) return ie$typeNameOf;
  return function() { return constructorNameWithFallback(this); };
})());
function $notnull_bool(test) {
  if (test === true || test === false) return test;
  $throw(new TypeError(test, 'bool'));
}
function $throw(e) {
  // If e is not a value, we can use V8's captureStackTrace utility method.
  // TODO(jmesserly): capture the stack trace on other JS engines.
  if (e && (typeof e == 'object') && Error.captureStackTrace) {
    // TODO(jmesserly): this will clobber the e.stack property
    Error.captureStackTrace(e, $throw);
  }
  throw e;
}
$defProp(Object.prototype, '$index', function(i) {
  $throw(new NoSuchMethodException(this, "operator []", [i]));
});
$defProp(Array.prototype, '$index', function(index) {
  var i = index | 0;
  if (i !== index) {
    throw new IllegalArgumentException('index is not int');
  } else if (i < 0 || i >= this.length) {
    throw new IndexOutOfRangeException(index);
  }
  return this[i];
});
$defProp(String.prototype, '$index', function(i) {
  return this[i];
});
$defProp(Object.prototype, '$setindex', function(i, value) {
  $throw(new NoSuchMethodException(this, "operator []=", [i, value]));
});
$defProp(Array.prototype, '$setindex', function(index, value) {
  var i = index | 0;
  if (i !== index) {
    throw new IllegalArgumentException('index is not int');
  } else if (i < 0 || i >= this.length) {
    throw new IndexOutOfRangeException(index);
  }
  return this[i] = value;
});
function $add$complex$(x, y) {
  if (typeof(x) == 'number') {
    $throw(new IllegalArgumentException(y));
  } else if (typeof(x) == 'string') {
    var str = (y == null) ? 'null' : y.toString();
    if (typeof(str) != 'string') {
      throw new Error("calling toString() on right hand operand of operator " +
      "+ did not return a String");
    }
    return x + str;
  } else if (typeof(x) == 'object') {
    return x.$add(y);
  } else {
    $throw(new NoSuchMethodException(x, "operator +", [y]));
  }
}

function $add$(x, y) {
  if (typeof(x) == 'number' && typeof(y) == 'number') return x + y;
  return $add$complex$(x, y);
}
function $eq$(x, y) {
  if (x == null) return y == null;
  return (typeof(x) != 'object') ? x === y : x.$eq(y);
}
// TODO(jimhug): Should this or should it not match equals?
$defProp(Object.prototype, '$eq', function(other) {
  return this === other;
});
function $mod$(x, y) {
  if (typeof(x) == 'number') {
    if (typeof(y) == 'number') {
      var result = x % y;
      if (result == 0) {
        return 0;  // Make sure we don't return -0.0.
      } else if (result < 0) {
        if (y < 0) {
          return result - y;
        } else {
          return result + y;
        }
      }
      return result;
    } else {
      $throw(new IllegalArgumentException(y));
    }
  } else if (typeof(x) == 'object') {
    return x.$mod(y);
  } else {
    $throw(new NoSuchMethodException(x, "operator %", [y]));
  }
}
function $ne$(x, y) {
  if (x == null) return y != null;
  return (typeof(x) != 'object') ? x !== y : !x.$eq(y);
}
function $truncdiv$(x, y) {
  if (typeof(x) == 'number') {
    if (typeof(y) == 'number') {
      if (y == 0) $throw(new IntegerDivisionByZeroException());
      var tmp = x / y;
      return (tmp < 0) ? Math.ceil(tmp) : Math.floor(tmp);
    } else {
      $throw(new IllegalArgumentException(y));
    }
  } else if (typeof(x) == 'object') {
    return x.$truncdiv(y);
  } else {
    $throw(new NoSuchMethodException(x, "operator ~/", [y]));
  }
}
// ********** Code for Object **************
$defProp(Object.prototype, "noSuchMethod", function(name, args) {
  $throw(new NoSuchMethodException(this, name, args));
});
$defProp(Object.prototype, "add$1", function($0) {
  return this.noSuchMethod("add", [$0]);
});
$defProp(Object.prototype, "addAll$1", function($0) {
  return this.noSuchMethod("addAll", [$0]);
});
$defProp(Object.prototype, "addLast$1", function($0) {
  return this.noSuchMethod("addLast", [$0]);
});
$defProp(Object.prototype, "assert$CanvasElement", function() {
  $throw(new TypeError._internal$ctor(this, "CanvasElement"));
});
$defProp(Object.prototype, "assert$Collection", function() {
  $throw(new TypeError._internal$ctor(this, "Collection"));
});
$defProp(Object.prototype, "assert$Collection_ClientRect", function() {
  $throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"));
});
$defProp(Object.prototype, "assert$Collection_Element", function() {
  $throw(new TypeError._internal$ctor(this, "Collection<html.Element>"));
});
$defProp(Object.prototype, "assert$Collection_Firework", function() {
  $throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"));
});
$defProp(Object.prototype, "assert$Collection_Future", function() {
  $throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"));
});
$defProp(Object.prototype, "assert$Collection_Node", function() {
  $throw(new TypeError._internal$ctor(this, "Collection<html.Node>"));
});
$defProp(Object.prototype, "assert$Collection_Object", function() {
  $throw(new TypeError._internal$ctor(this, "Collection<dart:core.Object>"));
});
$defProp(Object.prototype, "assert$Collection_Spark", function() {
  $throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"));
});
$defProp(Object.prototype, "assert$Collection_String", function() {
  $throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"));
});
$defProp(Object.prototype, "assert$Collection_StyleSheet", function() {
  $throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"));
});
$defProp(Object.prototype, "assert$Collection_TimeoutHandler", function() {
  $throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"));
});
$defProp(Object.prototype, "assert$Collection_Touch", function() {
  $throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"));
});
$defProp(Object.prototype, "assert$Collection__MeasurementRequest", function() {
  $throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"));
});
$defProp(Object.prototype, "assert$Collection__NodeImpl", function() {
  $throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"));
});
$defProp(Object.prototype, "assert$Collection_dart_core_Function", function() {
  $throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"));
});
$defProp(Object.prototype, "assert$Collection_int", function() {
  $throw(new TypeError._internal$ctor(this, "Collection<dart:core.int>"));
});
$defProp(Object.prototype, "assert$Collection_num", function() {
  $throw(new TypeError._internal$ctor(this, "Collection<dart:core.num>"));
});
$defProp(Object.prototype, "assert$Duration", function() {
  $throw(new TypeError._internal$ctor(this, "Duration"));
});
$defProp(Object.prototype, "assert$ElementList", function() {
  $throw(new TypeError._internal$ctor(this, "ElementList"));
});
$defProp(Object.prototype, "assert$ElementRect", function() {
  $throw(new TypeError._internal$ctor(this, "ElementRect"));
});
$defProp(Object.prototype, "assert$Firework", function() {
  $throw(new TypeError._internal$ctor(this, "Firework"));
});
$defProp(Object.prototype, "assert$Future", function() {
  $throw(new TypeError._internal$ctor(this, "Future"));
});
$defProp(Object.prototype, "assert$Iterable", function() {
  $throw(new TypeError._internal$ctor(this, "Iterable"));
});
$defProp(Object.prototype, "assert$Iterator", function() {
  $throw(new TypeError._internal$ctor(this, "Iterator"));
});
$defProp(Object.prototype, "assert$Iterator_Element", function() {
  $throw(new TypeError._internal$ctor(this, "Iterator<html.Element>"));
});
$defProp(Object.prototype, "assert$KeyValuePair", function() {
  $throw(new TypeError._internal$ctor(this, "KeyValuePair"));
});
$defProp(Object.prototype, "assert$List", function() {
  $throw(new TypeError._internal$ctor(this, "List"));
});
$defProp(Object.prototype, "assert$ListFactory", function() {
  $throw(new TypeError._internal$ctor(this, "ListFactory"));
});
$defProp(Object.prototype, "assert$List_Element", function() {
  $throw(new TypeError._internal$ctor(this, "List<html.Element>"));
});
$defProp(Object.prototype, "assert$Map", function() {
  $throw(new TypeError._internal$ctor(this, "Map"));
});
$defProp(Object.prototype, "assert$Spark", function() {
  $throw(new TypeError._internal$ctor(this, "Spark"));
});
$defProp(Object.prototype, "assert$StringBuffer", function() {
  $throw(new TypeError._internal$ctor(this, "StringBuffer"));
});
$defProp(Object.prototype, "assert$_ElementImpl", function() {
  $throw(new TypeError._internal$ctor(this, "_ElementImpl"));
});
$defProp(Object.prototype, "assert$_MeasurementRequest", function() {
  $throw(new TypeError._internal$ctor(this, "_MeasurementRequest"));
});
$defProp(Object.prototype, "assert$_NodeImpl", function() {
  $throw(new TypeError._internal$ctor(this, "_NodeImpl"));
});
$defProp(Object.prototype, "assert$_NodeListImpl", function() {
  $throw(new TypeError._internal$ctor(this, "_NodeListImpl"));
});
$defProp(Object.prototype, "assert$html_CSSStyleDeclaration", function() {
  $throw(new TypeError._internal$ctor(this, "CSSStyleDeclaration"));
});
$defProp(Object.prototype, "assert$html_CanvasRenderingContext2D", function() {
  $throw(new TypeError._internal$ctor(this, "CanvasRenderingContext2D"));
});
$defProp(Object.prototype, "assert$html_ClientRect", function() {
  $throw(new TypeError._internal$ctor(this, "ClientRect"));
});
$defProp(Object.prototype, "assert$html_Element", function() {
  $throw(new TypeError._internal$ctor(this, "Element"));
});
$defProp(Object.prototype, "assert$html_Node", function() {
  $throw(new TypeError._internal$ctor(this, "Node"));
});
$defProp(Object.prototype, "assert$html_StyleSheet", function() {
  $throw(new TypeError._internal$ctor(this, "StyleSheet"));
});
$defProp(Object.prototype, "assert$html_Touch", function() {
  $throw(new TypeError._internal$ctor(this, "Touch"));
});
$defProp(Object.prototype, "clear$0", function() {
  return this.noSuchMethod("clear", []);
});
$defProp(Object.prototype, "complete$1", function($0) {
  return this.noSuchMethod("complete", [$0]);
});
$defProp(Object.prototype, "forEach$1", function($0) {
  return this.noSuchMethod("forEach", [$0]);
});
$defProp(Object.prototype, "is$Collection", function() {
  return false;
});
$defProp(Object.prototype, "is$List", function() {
  return false;
});
$defProp(Object.prototype, "is$Map", function() {
  return false;
});
$defProp(Object.prototype, "is$html_Element", function() {
  return false;
});
$defProp(Object.prototype, "remove$0", function() {
  return this.noSuchMethod("remove", []);
});
// ********** Code for Clock **************
function Clock() {}
Clock.now = function() {
  return new Date().getTime();
}
Clock.frequency = function() {
  return (1000);
}
// ********** Code for AssertionError **************
AssertionError._internal$ctor = function(failedAssertion, url, line, column) {
  this.failedAssertion = failedAssertion;
  this.url = url;
  this.line = line;
  this.column = column;
}
AssertionError._internal$ctor.prototype = AssertionError.prototype;
function AssertionError() {}
AssertionError.prototype.toString = function() {
  return $add$(("Failed assertion: '" + this.failedAssertion + "' is not true "), ("in " + this.url + " at line " + this.line + ", column " + this.column + "."));
}
// ********** Code for TypeError **************
TypeError._internal$ctor = function(src, dstType) {
  this.srcType = (src == null ? "Null" : src.$typeNameOf());
  this.dstType = dstType;
  this.toString = function() {
    return ("Failed type check: type " + this.srcType +
        " is not assignable to type " + this.dstType);
  }
}
TypeError._internal$ctor.prototype = TypeError.prototype;
// ********** Code for IndexOutOfRangeException **************
function IndexOutOfRangeException(_index) {
  this._index = _index;
}
IndexOutOfRangeException.prototype.is$IndexOutOfRangeException = function(){return true};
IndexOutOfRangeException.prototype.toString = function() {
  return ("IndexOutOfRangeException: " + this._index);
}
// ********** Code for IllegalAccessException **************
function IllegalAccessException() {

}
IllegalAccessException.prototype.toString = function() {
  return "Attempt to modify an immutable object";
}
// ********** Code for NoSuchMethodException **************
function NoSuchMethodException(_receiver, _functionName, _arguments, _existingArgumentNames) {
  this._receiver = _receiver;
  this._functionName = _functionName;
  this._arguments = _arguments;
  this._existingArgumentNames = _existingArgumentNames;
}
NoSuchMethodException.prototype.is$NoSuchMethodException = function(){return true};
NoSuchMethodException.prototype.toString = function() {
  var sb = new StringBufferImpl("");
  for (var i = (0);
   i < this._arguments.get$length(); i++) {
    if (i > (0)) {
      sb.add(", ");
    }
    sb.add(this._arguments.$index(i));
  }
  if (null == this._existingArgumentNames) {
    return $add$($add$(("NoSuchMethodException : method not found: '" + this._functionName + "'\n"), ("Receiver: " + this._receiver + "\n")), ("Arguments: [" + sb + "]"));
  }
  else {
    var actualParameters = sb.toString();
    sb = new StringBufferImpl("");
    for (var i = (0);
     i < this._existingArgumentNames.get$length(); i++) {
      if (i > (0)) {
        sb.add(", ");
      }
      sb.add(this._existingArgumentNames.$index(i));
    }
    var formalParameters = sb.toString();
    return $add$($add$($add$("NoSuchMethodException: incorrect number of arguments passed to ", ("method named '" + this._functionName + "'\nReceiver: " + this._receiver + "\n")), ("Tried calling: " + this._functionName + "(" + actualParameters + ")\n")), ("Found: " + this._functionName + "(" + formalParameters + ")"));
  }
}
// ********** Code for ClosureArgumentMismatchException **************
function ClosureArgumentMismatchException() {

}
ClosureArgumentMismatchException.prototype.toString = function() {
  return "Closure argument mismatch";
}
// ********** Code for ObjectNotClosureException **************
function ObjectNotClosureException() {

}
ObjectNotClosureException.prototype.toString = function() {
  return "Object is not closure";
}
// ********** Code for IllegalArgumentException **************
function IllegalArgumentException(arg) {
  this._arg = arg;
}
IllegalArgumentException.prototype.is$IllegalArgumentException = function(){return true};
IllegalArgumentException.prototype.toString = function() {
  return ("Illegal argument(s): " + this._arg);
}
// ********** Code for StackOverflowException **************
function StackOverflowException() {

}
StackOverflowException.prototype.toString = function() {
  return "Stack Overflow";
}
// ********** Code for BadNumberFormatException **************
function BadNumberFormatException(_s) {
  this._s = _s;
}
BadNumberFormatException.prototype.toString = function() {
  return ("BadNumberFormatException: '" + this._s + "'");
}
// ********** Code for NullPointerException **************
function NullPointerException() {

}
NullPointerException.prototype.toString = function() {
  return "NullPointerException";
}
// ********** Code for NoMoreElementsException **************
function NoMoreElementsException() {

}
NoMoreElementsException.prototype.toString = function() {
  return "NoMoreElementsException";
}
// ********** Code for EmptyQueueException **************
function EmptyQueueException() {

}
EmptyQueueException.prototype.toString = function() {
  return "EmptyQueueException";
}
// ********** Code for UnsupportedOperationException **************
function UnsupportedOperationException(_message) {
  this._message = _message;
}
UnsupportedOperationException.prototype.toString = function() {
  return ("UnsupportedOperationException: " + this._message);
}
// ********** Code for NotImplementedException **************
function NotImplementedException() {

}
NotImplementedException.prototype.toString = function() {
  return "NotImplementedException";
}
// ********** Code for IntegerDivisionByZeroException **************
function IntegerDivisionByZeroException() {

}
IntegerDivisionByZeroException.prototype.is$IntegerDivisionByZeroException = function(){return true};
IntegerDivisionByZeroException.prototype.toString = function() {
  return "IntegerDivisionByZeroException";
}
// ********** Code for dart_core_Function **************
Function.prototype.to$call$0 = function() {
  this.call$0 = this._genStub(0);
  this.to$call$0 = function() { return this.call$0; };
  return this.call$0;
};
Function.prototype.call$0 = function() {
  return this.to$call$0()();
};
function to$call$0(f) { return f && f.to$call$0(); }
Function.prototype.to$call$1 = function() {
  this.call$1 = this._genStub(1);
  this.to$call$1 = function() { return this.call$1; };
  return this.call$1;
};
Function.prototype.call$1 = function($0) {
  return this.to$call$1()($0);
};
function to$call$1(f) { return f && f.to$call$1(); }
Function.prototype.to$call$2 = function() {
  this.call$2 = this._genStub(2);
  this.to$call$2 = function() { return this.call$2; };
  return this.call$2;
};
Function.prototype.call$2 = function($0, $1) {
  return this.to$call$2()($0, $1);
};
function to$call$2(f) { return f && f.to$call$2(); }
function $assert_Function(x) {
  if (x == null || typeof(x) == "function") return x;
  $throw(new TypeError._internal$ctor(x, "Function"))
}
// ********** Code for FutureNotCompleteException **************
function FutureNotCompleteException() {

}
FutureNotCompleteException.prototype.toString = function() {
  return "Exception: future has not been completed";
}
// ********** Code for FutureAlreadyCompleteException **************
function FutureAlreadyCompleteException() {

}
FutureAlreadyCompleteException.prototype.toString = function() {
  return "Exception: future already completed";
}
// ********** Code for Math **************
function $assert_num(x) {
  if (x == null || typeof(x) == "number") return x;
  $throw(new TypeError._internal$ctor(x, "num"))
}
function $assert_String(x) {
  if (x == null || typeof(x) == "string") return x;
  $throw(new TypeError._internal$ctor(x, "String"))
}
// ********** Code for top level **************
function print$(obj) {
  return _print(obj);
}
function _print(obj) {
  if (typeof console == 'object') {
    if (obj) obj = obj.toString();
    console.log(obj);
  } else if (typeof write === 'function') {
    write(obj);
    write('\n');
  }
}
function _assert(test, text, url, line, column) {
  if ((typeof(test) == 'function')) test = test.call$0();
  if (!$notnull_bool(test)) $throw(new AssertionError._internal$ctor(text, url, line, column));
}
function _toDartException(e) {
  function attachStack(dartEx) {
    // TODO(jmesserly): setting the stack property is not a long term solution.
    var stack = e.stack;
    // The stack contains the error message, and the stack is all that is
    // printed (the exception's toString() is never called).  Make the Dart
    // exception's toString() be the dominant message.
    if (typeof stack == 'string') {
      var message = dartEx.toString();
      if (/^(Type|Range)Error:/.test(stack)) {
        // Indent JS message (it can be helpful) so new message stands out.
        stack = '    (' + stack.substring(0, stack.indexOf('\n')) + ')\n' +
                stack.substring(stack.indexOf('\n') + 1);
      }
      stack = message + '\n' + stack;
    }
    dartEx.stack = stack;
    return dartEx;
  }

  if (e instanceof TypeError) {
    switch(e.type) {
      case 'property_not_function':
      case 'called_non_callable':
        if (e.arguments[0] == null) {
          return attachStack(new NullPointerException());
        } else {
          return attachStack(new ObjectNotClosureException());
        }
        break;
      case 'non_object_property_call':
      case 'non_object_property_load':
        return attachStack(new NullPointerException());
        break;
      case 'undefined_method':
        var mname = e.arguments[0];
        if (typeof(mname) == 'string' && (mname.indexOf('call$') == 0
            || mname == 'call' || mname == 'apply')) {
          return attachStack(new ObjectNotClosureException());
        } else {
          // TODO(jmesserly): fix noSuchMethod on operators so we don't hit this
          return attachStack(new NoSuchMethodException('', e.arguments[0], []));
        }
        break;
    }
  } else if (e instanceof RangeError) {
    if (e.message.indexOf('call stack') >= 0) {
      return attachStack(new StackOverflowException());
    }
  }
  return e;
}
function $assert_void(x) {
  if (x == null) return null;
  $throw(new TypeError._internal$ctor(x, "void"))
}
//  ********** Library dart:coreimpl **************
// ********** Code for ListFactory **************
ListFactory = Array;
$defProp(ListFactory.prototype, "assert$ListFactory", function(){return this});
$defProp(ListFactory.prototype, "is$List", function(){return true});
$defProp(ListFactory.prototype, "assert$List", function(){return this});
$defProp(ListFactory.prototype, "assert$List_Element", function(){return this});
$defProp(ListFactory.prototype, "is$Collection", function(){return true});
$defProp(ListFactory.prototype, "assert$Collection", function(){return this});
$defProp(ListFactory.prototype, "assert$Collection_Firework", function(){return this});
$defProp(ListFactory.prototype, "assert$Collection_Spark", function(){return this});
$defProp(ListFactory.prototype, "assert$Collection_dart_core_Function", function(){return this});
$defProp(ListFactory.prototype, "assert$Collection_Future", function(){return this});
$defProp(ListFactory.prototype, "assert$Collection_Object", function(){return this});
$defProp(ListFactory.prototype, "assert$Collection_String", function(){return this});
$defProp(ListFactory.prototype, "assert$Collection_int", function(){return this});
$defProp(ListFactory.prototype, "assert$Collection_num", function(){return this});
$defProp(ListFactory.prototype, "assert$Collection_ClientRect", function(){return this});
$defProp(ListFactory.prototype, "assert$Collection_Element", function(){return this});
$defProp(ListFactory.prototype, "assert$Collection_Node", function(){return this});
$defProp(ListFactory.prototype, "assert$Collection_StyleSheet", function(){return this});
$defProp(ListFactory.prototype, "assert$Collection_TimeoutHandler", function(){return this});
$defProp(ListFactory.prototype, "assert$Collection_Touch", function(){return this});
$defProp(ListFactory.prototype, "assert$Collection__MeasurementRequest", function(){return this});
$defProp(ListFactory.prototype, "assert$Collection__NodeImpl", function(){return this});
$defProp(ListFactory.prototype, "assert$Iterable", function(){return this});
ListFactory.ListFactory$from$factory = function(other) {
  var list = [];
  for (var $$i = other.iterator(); $$i.hasNext(); ) {
    var e = $$i.next();
    list.add$1(e);
  }
  return (list == null ? null : list.assert$ListFactory());
}
$defProp(ListFactory.prototype, "get$length", function() { return this.length; });
$defProp(ListFactory.prototype, "set$length", function(value) { return this.length = value; });
$defProp(ListFactory.prototype, "add", function(value) {
  this.push(value);
});
$defProp(ListFactory.prototype, "addLast", function(value) {
  this.push(value);
});
$defProp(ListFactory.prototype, "addAll", function(collection) {
  for (var $$i = collection.iterator(); $$i.hasNext(); ) {
    var item = $$i.next();
    this.add(item);
  }
});
$defProp(ListFactory.prototype, "clear", function() {
  this.set$length((0));
});
$defProp(ListFactory.prototype, "removeLast", function() {
  return this.pop();
});
$defProp(ListFactory.prototype, "last", function() {
  return this.$index(this.get$length() - (1));
});
$defProp(ListFactory.prototype, "getRange", function(start, length) {
      if (length == 0) return [];
      if (length < 0) throw new IllegalArgumentException('length');
      if (start < 0 || start + length > this.length)
        throw new IndexOutOfRangeException(start);
      return this.slice(start, start + length);
    
});
$defProp(ListFactory.prototype, "removeRange", function(start, length) {
      if (length == 0) return;
      if (length < 0) throw new IllegalArgumentException('length');
      if (start < 0 || start + length > this.length)
        throw new IndexOutOfRangeException(start);
      this.splice(start, length);
    
});
$defProp(ListFactory.prototype, "isEmpty", function() {
  return this.get$length() == (0);
});
$defProp(ListFactory.prototype, "iterator", function() {
  return new ListIterator(this);
});
$defProp(ListFactory.prototype, "toString", function() {
  return Collections.collectionToString(this);
});
$defProp(ListFactory.prototype, "add$1", ListFactory.prototype.add);
$defProp(ListFactory.prototype, "addAll$1", function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection()));
});
$defProp(ListFactory.prototype, "addLast$1", ListFactory.prototype.addLast);
$defProp(ListFactory.prototype, "clear$0", ListFactory.prototype.clear);
$defProp(ListFactory.prototype, "forEach$1", function($0) {
  return this.forEach(to$call$1($0));
});
// ********** Code for ListIterator **************
function ListIterator(array) {
  this._array = array;
  this._pos = (0);
}
ListIterator.prototype.assert$Iterator = function(){return this};
ListIterator.prototype.assert$Iterator_Element = function(){return this};
ListIterator.prototype.hasNext = function() {
  return this._array.get$length() > this._pos;
}
ListIterator.prototype.next = function() {
  if (!this.hasNext()) {
    $throw(const$0001);
  }
  return this._array.$index(this._pos++);
}
// ********** Code for ImmutableList **************
/** Implements extends for Dart classes on JavaScript prototypes. */
function $inherits(child, parent) {
  if (child.prototype.__proto__) {
    child.prototype.__proto__ = parent.prototype;
  } else {
    function tmp() {};
    tmp.prototype = parent.prototype;
    child.prototype = new tmp();
    child.prototype.constructor = child;
  }
}
$inherits(ImmutableList, ListFactory);
function ImmutableList(length) {
  Array.call(this, length);
}
ImmutableList.ImmutableList$from$factory = function(other) {
  return _constList(other);
}
ImmutableList.prototype.get$length = function() {
  return this.length;
}
ImmutableList.prototype.set$length = function(length) {
  $throw(const$0007);
}
ImmutableList.prototype.$setindex = function(index, value) {
  $throw(const$0007);
}
ImmutableList.prototype.removeRange = function(start, length) {
  $throw(const$0007);
}
ImmutableList.prototype.add = function(element) {
  $throw(const$0007);
}
ImmutableList.prototype.addLast = function(element) {
  $throw(const$0007);
}
ImmutableList.prototype.addAll = function(elements) {
  $throw(const$0007);
}
ImmutableList.prototype.clear = function() {
  $throw(const$0007);
}
ImmutableList.prototype.removeLast = function() {
  $throw(const$0007);
}
ImmutableList.prototype.toString = function() {
  return Collections.collectionToString(this);
}
ImmutableList.prototype.add$1 = ImmutableList.prototype.add;
ImmutableList.prototype.addAll$1 = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection()));
};
ImmutableList.prototype.addLast$1 = ImmutableList.prototype.addLast;
ImmutableList.prototype.clear$0 = ImmutableList.prototype.clear;
// ********** Code for NumImplementation **************
NumImplementation = Number;
NumImplementation.prototype.hashCode = function() {
  'use strict'; return this & 0x1FFFFFFF;
}
NumImplementation.prototype.toInt = function() {
    'use strict';
    if (isNaN(this)) $throw(new BadNumberFormatException("NaN"));
    if ((this == Infinity) || (this == -Infinity)) {
      $throw(new BadNumberFormatException("Infinity"));
    }
    var truncated = (this < 0) ? Math.ceil(this) : Math.floor(this);
    if (truncated == -0.0) return 0;
    return truncated;
}
// ********** Code for Collections **************
function Collections() {}
Collections.collectionToString = function(c) {
  var result = new StringBufferImpl("");
  Collections._emitCollection(c, (result == null ? null : result.assert$StringBuffer()), new Array());
  return result.toString();
}
Collections._emitCollection = function(c, result, visiting) {
  visiting.add$1(c);
  var isList = !!(c && c.is$List());
  result.add(isList ? "[" : "{");
  var first = true;
  for (var $$i = c.iterator(); $$i.hasNext(); ) {
    var e = $$i.next();
    if (!first) {
      result.add(", ");
    }
    first = false;
    Collections._emitObject(e, result, visiting);
  }
  result.add(isList ? "]" : "}");
  visiting.removeLast();
}
Collections._emitObject = function(o, result, visiting) {
  if (!!(o && o.is$Collection())) {
    if ($notnull_bool(Collections._containsRef(visiting, o))) {
      result.add(!!(o && o.is$List()) ? "[...]" : "{...}");
    }
    else {
      Collections._emitCollection((o == null ? null : o.assert$Collection()), result, visiting);
    }
  }
  else if (!!(o && o.is$Map())) {
    if ($notnull_bool(Collections._containsRef(visiting, o))) {
      result.add("{...}");
    }
    else {
      Maps._emitMap((o == null ? null : o.assert$Map()), result, visiting);
    }
  }
  else {
    result.add($eq$(o) ? "null" : o);
  }
}
Collections._containsRef = function(c, ref) {
  for (var $$i = c.iterator(); $$i.hasNext(); ) {
    var e = $$i.next();
    if ((null == e ? null == (ref) : e === ref)) return true;
  }
  return false;
}
// ********** Code for FutureImpl **************
function FutureImpl() {
  this._listeners = new Array();
  this._exceptionHandlers = new Array();
  this._isComplete = false;
  this._exceptionHandled = false;
}
FutureImpl.prototype.assert$Future = function(){return this};
FutureImpl.prototype.get$value = function() {
  if (!this.get$isComplete()) {
    $throw(new FutureNotCompleteException());
  }
  if (null != this._exception) {
    $throw(this._exception);
  }
  return this._value;
}
FutureImpl.prototype.get$isComplete = function() {
  return this._isComplete;
}
FutureImpl.prototype.get$hasValue = function() {
  return this.get$isComplete() && null == this._exception;
}
FutureImpl.prototype.then = function(onComplete) {
  if (this.get$hasValue()) {
    onComplete(this.get$value());
  }
  else if (!this.get$isComplete()) {
    this._listeners.add$1(onComplete);
  }
  else if (!this._exceptionHandled) {
    $throw(this._exception);
  }
}
FutureImpl.prototype._complete = function() {
  this._isComplete = true;
  if (null != this._exception) {
    var $$list = this._exceptionHandlers;
    for (var $$i = $$list.iterator(); $$i.hasNext(); ) {
      var handler = $$i.next();
      if ($notnull_bool(handler.call$1(this._exception))) {
        this._exceptionHandled = true;
        break;
      }
    }
  }
  if (this.get$hasValue()) {
    var $$list = this._listeners;
    for (var $$i = $$list.iterator(); $$i.hasNext(); ) {
      var listener = $$i.next();
      listener.call$1(this.get$value());
    }
  }
  else {
    if (!this._exceptionHandled && this._listeners.get$length() > (0)) {
      $throw(this._exception);
    }
  }
}
FutureImpl.prototype._setValue = function(value) {
  if (this._isComplete) {
    $throw(new FutureAlreadyCompleteException());
  }
  this._value = value;
  this._complete();
}
FutureImpl.prototype._setException = function(exception) {
  if (null == exception) {
    $throw(new IllegalArgumentException(null));
  }
  if (this._isComplete) {
    $throw(new FutureAlreadyCompleteException());
  }
  this._exception = exception;
  this._complete();
}
// ********** Code for CompleterImpl **************
function CompleterImpl() {}
CompleterImpl.prototype.get$future = function() {
  return this._futureImpl;
}
CompleterImpl.prototype.complete = function(value) {
  this._futureImpl._setValue(value);
}
CompleterImpl.prototype.completeException = function(exception) {
  this._futureImpl._setException(exception);
}
CompleterImpl.prototype.complete$1 = CompleterImpl.prototype.complete;
// ********** Code for CompleterImpl_ElementRect **************
$inherits(CompleterImpl_ElementRect, CompleterImpl);
function CompleterImpl_ElementRect() {
  this._futureImpl = new FutureImpl();
}
CompleterImpl_ElementRect.prototype.complete$1 = function($0) {
  return this.complete(($0 == null ? null : $0.assert$ElementRect()));
};
// ********** Code for HashMapImplementation **************
function HashMapImplementation() {
  this._numberOfEntries = (0);
  this._numberOfDeleted = (0);
  this._loadLimit = HashMapImplementation._computeLoadLimit((8));
  this._keys = new Array((8));
  this._values = new Array((8));
}
HashMapImplementation.prototype.is$Map = function(){return true};
HashMapImplementation.prototype.assert$Map = function(){return this};
HashMapImplementation._computeLoadLimit = function(capacity) {
  return $truncdiv$((capacity * (3)), (4));
}
HashMapImplementation._firstProbe = function(hashCode, length) {
  return hashCode & (length - (1));
}
HashMapImplementation._nextProbe = function(currentProbe, numberOfProbes, length) {
  return (currentProbe + numberOfProbes) & (length - (1));
}
HashMapImplementation.prototype._probeForAdding = function(key) {
  var hash = HashMapImplementation._firstProbe(key.hashCode(), this._keys.get$length());
  var numberOfProbes = (1);
  var initialHash = hash;
  var insertionIndex = (-1);
  while (true) {
    var existingKey = this._keys.$index(hash);
    if (null == existingKey) {
      if (insertionIndex < (0)) return hash;
      return insertionIndex;
    }
    else if ($eq$(existingKey, key)) {
      return hash;
    }
    else if ((insertionIndex < (0)) && ((null == const$0000 ? null == (existingKey) : const$0000 === existingKey))) {
      insertionIndex = hash;
    }
    hash = HashMapImplementation._nextProbe(hash, numberOfProbes++, this._keys.get$length());
  }
}
HashMapImplementation.prototype._ensureCapacity = function() {
  var newNumberOfEntries = this._numberOfEntries + (1);
  if (newNumberOfEntries >= this._loadLimit) {
    this._grow(this._keys.get$length() * (2));
    return;
  }
  var capacity = this._keys.get$length();
  var numberOfFreeOrDeleted = capacity - newNumberOfEntries;
  var numberOfFree = numberOfFreeOrDeleted - this._numberOfDeleted;
  if (this._numberOfDeleted > numberOfFree) {
    this._grow(this._keys.get$length());
  }
}
HashMapImplementation._isPowerOfTwo = function(x) {
  return ((x & (x - (1))) == (0));
}
HashMapImplementation.prototype._grow = function(newCapacity) {
  _assert(HashMapImplementation._isPowerOfTwo(newCapacity), "_isPowerOfTwo(newCapacity)", "/Users/gfx/Applications/dart-sdk/lib/coreimpl/frog/hash_map_set.dart", (148), (12));
  var capacity = this._keys.get$length();
  this._loadLimit = HashMapImplementation._computeLoadLimit(newCapacity);
  var oldKeys = this._keys;
  var oldValues = this._values;
  this._keys = new Array(newCapacity);
  this._values = new Array(newCapacity);
  for (var i = (0);
   i < capacity; i++) {
    var key = oldKeys.$index(i);
    if (null == key || (null == key ? null == (const$0000) : key === const$0000)) {
      continue;
    }
    var value = oldValues.$index(i);
    var newIndex = this._probeForAdding(key);
    this._keys.$setindex(newIndex, key);
    this._values.$setindex(newIndex, value);
  }
  this._numberOfDeleted = (0);
}
HashMapImplementation.prototype.clear = function() {
  this._numberOfEntries = (0);
  this._numberOfDeleted = (0);
  var length = this._keys.get$length();
  for (var i = (0);
   i < length; i++) {
    this._keys.$setindex(i);
    this._values.$setindex(i);
  }
}
HashMapImplementation.prototype.$setindex = function(key, value) {
  var $0;
  this._ensureCapacity();
  var index = this._probeForAdding(key);
  if ((null == this._keys.$index(index)) || ((($0 = this._keys.$index(index)) == null ? null == (const$0000) : $0 === const$0000))) {
    this._numberOfEntries++;
  }
  this._keys.$setindex(index, key);
  this._values.$setindex(index, value);
}
HashMapImplementation.prototype.isEmpty = function() {
  return this._numberOfEntries == (0);
}
HashMapImplementation.prototype.forEach = function(f) {
  var length = this._keys.get$length();
  for (var i = (0);
   i < length; i++) {
    var key = this._keys.$index(i);
    if ((null != key) && ((null == key ? null != (const$0000) : key !== const$0000))) {
      f(key, this._values.$index(i));
    }
  }
}
HashMapImplementation.prototype.toString = function() {
  return Maps.mapToString(this);
}
HashMapImplementation.prototype.clear$0 = HashMapImplementation.prototype.clear;
HashMapImplementation.prototype.forEach$1 = function($0) {
  return this.forEach(to$call$2($0));
};
// ********** Code for HashSetImplementation **************
function HashSetImplementation() {
  this._backingMap = new HashMapImplementation();
}
HashSetImplementation.prototype.is$Collection = function(){return true};
HashSetImplementation.prototype.assert$Collection = function(){return this};
HashSetImplementation.prototype.assert$Collection_Firework = function(){return this};
HashSetImplementation.prototype.assert$Collection_Spark = function(){return this};
HashSetImplementation.prototype.assert$Collection_dart_core_Function = function(){return this};
HashSetImplementation.prototype.assert$Collection_Future = function(){return this};
HashSetImplementation.prototype.assert$Collection_Object = function(){return this};
HashSetImplementation.prototype.assert$Collection_String = function(){return this};
HashSetImplementation.prototype.assert$Collection_int = function(){return this};
HashSetImplementation.prototype.assert$Collection_num = function(){return this};
HashSetImplementation.prototype.assert$Collection_ClientRect = function(){return this};
HashSetImplementation.prototype.assert$Collection_Element = function(){return this};
HashSetImplementation.prototype.assert$Collection_Node = function(){return this};
HashSetImplementation.prototype.assert$Collection_StyleSheet = function(){return this};
HashSetImplementation.prototype.assert$Collection_TimeoutHandler = function(){return this};
HashSetImplementation.prototype.assert$Collection_Touch = function(){return this};
HashSetImplementation.prototype.assert$Collection__MeasurementRequest = function(){return this};
HashSetImplementation.prototype.assert$Collection__NodeImpl = function(){return this};
HashSetImplementation.prototype.assert$Iterable = function(){return this};
HashSetImplementation.prototype.clear = function() {
  this._backingMap.clear();
}
HashSetImplementation.prototype.add = function(value) {
  this._backingMap.$setindex(value, value);
}
HashSetImplementation.prototype.addAll = function(collection) {
  var $this = this; // closure support
  collection.forEach(function _(value) {
    $this.add(value);
  }
  );
}
HashSetImplementation.prototype.forEach = function(f) {
  this._backingMap.forEach(function _(key, value) {
    f(key);
  }
  );
}
HashSetImplementation.prototype.filter = function(f) {
  var result = new HashSetImplementation();
  this._backingMap.forEach(function _(key, value) {
    if (f(key)) result.add$1(key);
  }
  );
  return result;
}
HashSetImplementation.prototype.isEmpty = function() {
  return this._backingMap.isEmpty();
}
HashSetImplementation.prototype.iterator = function() {
  return new HashSetIterator(this);
}
HashSetImplementation.prototype.toString = function() {
  return Collections.collectionToString(this);
}
HashSetImplementation.prototype.add$1 = HashSetImplementation.prototype.add;
HashSetImplementation.prototype.addAll$1 = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection()));
};
HashSetImplementation.prototype.clear$0 = HashSetImplementation.prototype.clear;
HashSetImplementation.prototype.forEach$1 = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for HashSetIterator **************
function HashSetIterator(set_) {
  this._nextValidIndex = (-1);
  this._entries = set_._backingMap._keys;
  this._advance();
}
HashSetIterator.prototype.assert$Iterator = function(){return this};
HashSetIterator.prototype.assert$Iterator_Element = function(){return this};
HashSetIterator.prototype.hasNext = function() {
  var $0;
  if (this._nextValidIndex >= this._entries.get$length()) return false;
  if ((($0 = this._entries.$index(this._nextValidIndex)) == null ? null == (const$0000) : $0 === const$0000)) {
    this._advance();
  }
  return this._nextValidIndex < this._entries.get$length();
}
HashSetIterator.prototype.next = function() {
  if (!this.hasNext()) {
    $throw(const$0001);
  }
  var res = this._entries.$index(this._nextValidIndex);
  this._advance();
  return res;
}
HashSetIterator.prototype._advance = function() {
  var length = this._entries.get$length();
  var entry;
  var deletedKey = const$0000;
  do {
    if (++this._nextValidIndex >= length) break;
    entry = this._entries.$index(this._nextValidIndex);
  }
  while ((null == entry) || ((null == entry ? null == (deletedKey) : entry === deletedKey)))
}
// ********** Code for _DeletedKeySentinel **************
function _DeletedKeySentinel() {

}
// ********** Code for Maps **************
function Maps() {}
Maps.mapToString = function(m) {
  var result = new StringBufferImpl("");
  Maps._emitMap(m, (result == null ? null : result.assert$StringBuffer()), new Array());
  return result.toString();
}
Maps._emitMap = function(m, result, visiting) {
  visiting.add$1(m);
  result.add("{");
  var first = true;
  m.forEach((function (k, v) {
    if (!first) {
      result.add(", ");
    }
    first = false;
    Collections._emitObject(k, result, visiting);
    result.add(": ");
    Collections._emitObject(v, result, visiting);
  })
  );
  result.add("}");
  visiting.removeLast();
}
// ********** Code for DoubleLinkedQueueEntry **************
function DoubleLinkedQueueEntry(e) {
  this._element = e;
}
DoubleLinkedQueueEntry.prototype._link = function(p, n) {
  this._next = n;
  this._previous = p;
  p._next = this;
  n._previous = this;
}
DoubleLinkedQueueEntry.prototype.prepend = function(e) {
  new DoubleLinkedQueueEntry(e)._link(this._previous, this);
}
DoubleLinkedQueueEntry.prototype.remove = function() {
  this._previous._next = this._next;
  this._next._previous = this._previous;
  this._next = null;
  this._previous = null;
  return this._element;
}
DoubleLinkedQueueEntry.prototype.get$element = function() {
  return this._element;
}
DoubleLinkedQueueEntry.prototype.remove$0 = DoubleLinkedQueueEntry.prototype.remove;
// ********** Code for _DoubleLinkedQueueEntrySentinel **************
$inherits(_DoubleLinkedQueueEntrySentinel, DoubleLinkedQueueEntry);
function _DoubleLinkedQueueEntrySentinel() {
  DoubleLinkedQueueEntry.call(this, null);
  this._link(this, this);
}
_DoubleLinkedQueueEntrySentinel.prototype.remove = function() {
  $throw(const$0002);
}
_DoubleLinkedQueueEntrySentinel.prototype.get$element = function() {
  $throw(const$0002);
}
_DoubleLinkedQueueEntrySentinel.prototype.remove$0 = _DoubleLinkedQueueEntrySentinel.prototype.remove;
// ********** Code for DoubleLinkedQueue **************
function DoubleLinkedQueue() {
  this._sentinel = new _DoubleLinkedQueueEntrySentinel();
}
DoubleLinkedQueue.prototype.is$Collection = function(){return true};
DoubleLinkedQueue.prototype.assert$Collection = function(){return this};
DoubleLinkedQueue.prototype.assert$Collection_Firework = function(){return this};
DoubleLinkedQueue.prototype.assert$Collection_Spark = function(){return this};
DoubleLinkedQueue.prototype.assert$Collection_dart_core_Function = function(){return this};
DoubleLinkedQueue.prototype.assert$Collection_Future = function(){return this};
DoubleLinkedQueue.prototype.assert$Collection_Object = function(){return this};
DoubleLinkedQueue.prototype.assert$Collection_String = function(){return this};
DoubleLinkedQueue.prototype.assert$Collection_int = function(){return this};
DoubleLinkedQueue.prototype.assert$Collection_num = function(){return this};
DoubleLinkedQueue.prototype.assert$Collection_ClientRect = function(){return this};
DoubleLinkedQueue.prototype.assert$Collection_Element = function(){return this};
DoubleLinkedQueue.prototype.assert$Collection_Node = function(){return this};
DoubleLinkedQueue.prototype.assert$Collection_StyleSheet = function(){return this};
DoubleLinkedQueue.prototype.assert$Collection_TimeoutHandler = function(){return this};
DoubleLinkedQueue.prototype.assert$Collection_Touch = function(){return this};
DoubleLinkedQueue.prototype.assert$Collection__MeasurementRequest = function(){return this};
DoubleLinkedQueue.prototype.assert$Collection__NodeImpl = function(){return this};
DoubleLinkedQueue.prototype.assert$Iterable = function(){return this};
DoubleLinkedQueue.prototype.addLast = function(value) {
  this._sentinel.prepend(value);
}
DoubleLinkedQueue.prototype.add = function(value) {
  this.addLast(value);
}
DoubleLinkedQueue.prototype.addAll = function(collection) {
  for (var $$i = collection.iterator(); $$i.hasNext(); ) {
    var e = $$i.next();
    this.add(e);
  }
}
DoubleLinkedQueue.prototype.isEmpty = function() {
  var $0;
  return ((($0 = this._sentinel._next) == null ? null == (this._sentinel) : $0 === this._sentinel));
}
DoubleLinkedQueue.prototype.clear = function() {
  this._sentinel._next = this._sentinel;
  this._sentinel._previous = this._sentinel;
}
DoubleLinkedQueue.prototype.forEach = function(f) {
  var entry = this._sentinel._next;
  while ((null == entry ? null != (this._sentinel) : entry !== this._sentinel)) {
    var nextEntry = entry._next;
    f(entry._element);
    entry = nextEntry;
  }
}
DoubleLinkedQueue.prototype.filter = function(f) {
  var other = new DoubleLinkedQueue();
  var entry = this._sentinel._next;
  while ((null == entry ? null != (this._sentinel) : entry !== this._sentinel)) {
    var nextEntry = entry._next;
    if (f(entry._element)) other.addLast$1(entry._element);
    entry = nextEntry;
  }
  return other;
}
DoubleLinkedQueue.prototype.iterator = function() {
  return new _DoubleLinkedQueueIterator(this._sentinel);
}
DoubleLinkedQueue.prototype.toString = function() {
  return Collections.collectionToString(this);
}
DoubleLinkedQueue.prototype.add$1 = DoubleLinkedQueue.prototype.add;
DoubleLinkedQueue.prototype.addAll$1 = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection()));
};
DoubleLinkedQueue.prototype.addLast$1 = DoubleLinkedQueue.prototype.addLast;
DoubleLinkedQueue.prototype.clear$0 = DoubleLinkedQueue.prototype.clear;
DoubleLinkedQueue.prototype.forEach$1 = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _DoubleLinkedQueueIterator **************
function _DoubleLinkedQueueIterator(_sentinel) {
  this._sentinel = _sentinel;
  this._currentEntry = this._sentinel;
}
_DoubleLinkedQueueIterator.prototype.assert$Iterator = function(){return this};
_DoubleLinkedQueueIterator.prototype.assert$Iterator_Element = function(){return this};
_DoubleLinkedQueueIterator.prototype.hasNext = function() {
  var $0;
  return (($0 = this._currentEntry._next) == null ? null != (this._sentinel) : $0 !== this._sentinel);
}
_DoubleLinkedQueueIterator.prototype.next = function() {
  if (!this.hasNext()) {
    $throw(const$0001);
  }
  this._currentEntry = this._currentEntry._next;
  return this._currentEntry.get$element();
}
// ********** Code for StopwatchImplementation **************
StopwatchImplementation.start$ctor = function() {
  this._start = null;
  this._stop = null;
  this.start();
}
StopwatchImplementation.start$ctor.prototype = StopwatchImplementation.prototype;
function StopwatchImplementation() {}
StopwatchImplementation.prototype.start = function() {
  if (null == this._start) {
    this._start = Clock.now();
  }
  else {
    if (null == this._stop) {
      return;
    }
    this._start = Clock.now() - (this._stop - this._start);
    this._stop = null;
  }
}
StopwatchImplementation.prototype.reset = function() {
  if (null == this._start) return;
  this._start = Clock.now();
  if (null != this._stop) {
    this._stop = this._start;
  }
}
StopwatchImplementation.prototype.elapsed = function() {
  if (null == this._start) {
    return (0);
  }
  return (null == this._stop) ? (Clock.now() - this._start) : (this._stop - this._start);
}
StopwatchImplementation.prototype.elapsedInMs = function() {
  return $truncdiv$((this.elapsed() * (1000)), this.frequency());
}
StopwatchImplementation.prototype.frequency = function() {
  return Clock.frequency();
}
// ********** Code for StringBufferImpl **************
function StringBufferImpl(content) {
  this.clear();
  this.add(content);
}
StringBufferImpl.prototype.assert$StringBuffer = function(){return this};
StringBufferImpl.prototype.add = function(obj) {
  var str = obj.toString();
  if (null == str || str.isEmpty()) return this;
  this._buffer.add(str);
  this._length = this._length + str.length;
  return this;
}
StringBufferImpl.prototype.addAll = function(objects) {
  for (var $$i = objects.iterator(); $$i.hasNext(); ) {
    var obj = $$i.next();
    this.add(obj);
  }
  return this;
}
StringBufferImpl.prototype.clear = function() {
  this._buffer = new Array();
  this._length = (0);
  return this;
}
StringBufferImpl.prototype.toString = function() {
  if (this._buffer.get$length() == (0)) return "";
  if (this._buffer.get$length() == (1)) return $assert_String(this._buffer.$index((0)));
  var result = StringBase.concatAll(this._buffer);
  this._buffer.clear();
  this._buffer.add(result);
  return result;
}
StringBufferImpl.prototype.add$1 = StringBufferImpl.prototype.add;
StringBufferImpl.prototype.addAll$1 = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_Object()));
};
StringBufferImpl.prototype.clear$0 = StringBufferImpl.prototype.clear;
// ********** Code for StringBase **************
function StringBase() {}
StringBase.join = function(strings, separator) {
  if (strings.get$length() == (0)) return "";
  var s = $assert_String(strings.$index((0)));
  for (var i = (1);
   i < strings.get$length(); i++) {
    s = $add$($add$(s, separator), strings.$index(i));
  }
  return s;
}
StringBase.concatAll = function(strings) {
  return StringBase.join(strings, "");
}
// ********** Code for StringImplementation **************
StringImplementation = String;
StringImplementation.prototype.isEmpty = function() {
  return this.length == (0);
}
StringImplementation.prototype.hashCode = function() {
      'use strict';
      var hash = 0;
      for (var i = 0; i < this.length; i++) {
        hash = 0x1fffffff & (hash + this.charCodeAt(i));
        hash = 0x1fffffff & (hash + ((0x0007ffff & hash) << 10));
        hash ^= hash >> 6;
      }

      hash = 0x1fffffff & (hash + ((0x03ffffff & hash) << 3));
      hash ^= hash >> 11;
      return 0x1fffffff & (hash + ((0x00003fff & hash) << 15));
}
// ********** Code for _ArgumentMismatchException **************
$inherits(_ArgumentMismatchException, ClosureArgumentMismatchException);
function _ArgumentMismatchException(_message) {
  this._dart_coreimpl_message = _message;
  ClosureArgumentMismatchException.call(this);
}
_ArgumentMismatchException.prototype.toString = function() {
  return ("Closure argument mismatch: " + this._dart_coreimpl_message);
}
// ********** Code for _FunctionImplementation **************
_FunctionImplementation = Function;
_FunctionImplementation.prototype._genStub = function(argsLength, names) {
      // Fast path #1: if no named arguments and arg count matches.
      var thisLength = this.$length || this.length;
      if (thisLength == argsLength && !names) {
        return this;
      }

      var paramsNamed = this.$optional ? (this.$optional.length / 2) : 0;
      var paramsBare = thisLength - paramsNamed;
      var argsNamed = names ? names.length : 0;
      var argsBare = argsLength - argsNamed;

      // Check we got the right number of arguments
      if (argsBare < paramsBare || argsLength > thisLength ||
          argsNamed > paramsNamed) {
        return function() {
          $throw(new _ArgumentMismatchException(
            'Wrong number of arguments to function. Expected ' + paramsBare +
            ' positional arguments and at most ' + paramsNamed +
            ' named arguments, but got ' + argsBare +
            ' positional arguments and ' + argsNamed + ' named arguments.'));
        };
      }

      // First, fill in all of the default values
      var p = new Array(paramsBare);
      if (paramsNamed) {
        p = p.concat(this.$optional.slice(paramsNamed));
      }
      // Fill in positional args
      var a = new Array(argsLength);
      for (var i = 0; i < argsBare; i++) {
        p[i] = a[i] = '$' + i;
      }
      // Then overwrite with supplied values for optional args
      var lastParameterIndex;
      var namesInOrder = true;
      for (var i = 0; i < argsNamed; i++) {
        var name = names[i];
        a[i + argsBare] = name;
        var j = this.$optional.indexOf(name);
        if (j < 0 || j >= paramsNamed) {
          return function() {
            $throw(new _ArgumentMismatchException(
              'Named argument "' + name + '" was not expected by function.' +
              ' Did you forget to mark the function parameter [optional]?'));
          };
        } else if (lastParameterIndex && lastParameterIndex > j) {
          namesInOrder = false;
        }
        p[j + paramsBare] = name;
        lastParameterIndex = j;
      }

      if (thisLength == argsLength && namesInOrder) {
        // Fast path #2: named arguments, but they're in order and all supplied.
        return this;
      }

      // Note: using Function instead of 'eval' to get a clean scope.
      // TODO(jmesserly): evaluate the performance of these stubs.
      var f = 'function(' + a.join(',') + '){return $f(' + p.join(',') + ');}';
      return new Function('$f', 'return ' + f + '').call(null, this);
    
}
// ********** Code for top level **************
function _constList(other) {
    other.__proto__ = ImmutableList.prototype;
    return other;
}
//  ********** Library html **************
// ********** Code for _EventTargetImpl **************
function $dynamic(name) {
  var f = Object.prototype[name];
  if (f && f.methods) return f.methods;

  var methods = {};
  if (f) methods.Object = f;
  function $dynamicBind() {
    // Find the target method
    var obj = this;
    var tag = obj.$typeNameOf();
    var method = methods[tag];
    if (!method) {
      var table = $dynamicMetadata;
      for (var i = 0; i < table.length; i++) {
        var entry = table[i];
        if (entry.map.hasOwnProperty(tag)) {
          method = methods[entry.tag];
          if (method) break;
        }
      }
    }
    method = method || methods.Object;
    var proto = Object.getPrototypeOf(obj);
    if (!proto.hasOwnProperty(name)) {
      $defProp(proto, name, method);
    }

    return method.apply(this, Array.prototype.slice.call(arguments));
  };
  $dynamicBind.methods = methods;
  $defProp(Object.prototype, name, $dynamicBind);
  return methods;
}
if (typeof $dynamicMetadata == 'undefined') $dynamicMetadata = [];
$dynamic("_addEventListener").EventTarget = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _NodeImpl **************
$dynamic("assert$_NodeImpl").Node = function(){return this};
$dynamic("assert$html_Node").Node = function(){return this};
$dynamic("get$nodes").Node = function() {
  var list = this.get$_childNodes();
  list.set$_parent(this);
  return (list == null ? null : list.assert$_NodeListImpl());
}
$dynamic("remove").Node = function() {
  var $0;
  if ($ne$(this.get$parent())) {
    var parent = (($0 = this.get$parent()) == null ? null : $0.assert$_NodeImpl());
    parent._removeChild(this);
  }
  return this;
}
$dynamic("replaceWith").Node = function(otherNode) {
  var $0;
  try {
    var parent = (($0 = this.get$parent()) == null ? null : $0.assert$_NodeImpl());
    parent._replaceChild((otherNode == null ? null : otherNode.assert$_NodeImpl()), this);
  } catch (e) {
    e = _toDartException(e);
  }
  ;
  return this;
}
$dynamic("get$_childNodes").Node = function() {
  return this.childNodes;
}
$dynamic("get$parent").Node = function() {
  return this.parentNode;
}
$dynamic("get$text").Node = function() {
  return this.textContent;
}
$dynamic("set$text").Node = function(value) {
  this.textContent = value;
}
$dynamic("_appendChild").Node = function(newChild) {
  return this.appendChild(newChild);
}
$dynamic("_removeChild").Node = function(oldChild) {
  return this.removeChild(oldChild);
}
$dynamic("_replaceChild").Node = function(newChild, oldChild) {
  return this.replaceChild(newChild, oldChild);
}
$dynamic("remove$0").Node = function() {
  return this.remove();
};
// ********** Code for _ElementImpl **************
$dynamic("assert$_ElementImpl").Element = function(){return this};
$dynamic("is$html_Element").Element = function(){return true};
$dynamic("assert$html_Element").Element = function(){return this};
$dynamic("assert$html_Node").Element = function(){return this};
$dynamic("get$elements").Element = function() {
  return new _ChildrenElementList._wrap$ctor(this);
}
$dynamic("get$rect").Element = function() {
  var $this = this; // closure support
  return _createMeasurementFuture((function () {
    return new _ElementRectImpl($this);
  })
  , new CompleterImpl_ElementRect());
}
$dynamic("get$on").Element = function() {
  return new _ElementEventsImpl(this);
}
$dynamic("get$_children").Element = function() {
  return this.children;
}
$dynamic("get$_clientHeight").Element = function() {
  return this.clientHeight;
}
$dynamic("get$_clientLeft").Element = function() {
  return this.clientLeft;
}
$dynamic("get$_clientTop").Element = function() {
  return this.clientTop;
}
$dynamic("get$_clientWidth").Element = function() {
  return this.clientWidth;
}
$dynamic("get$_firstElementChild").Element = function() {
  return this.firstElementChild;
}
$dynamic("set$innerHTML").Element = function(value) { return this.innerHTML = value; };
$dynamic("get$_offsetHeight").Element = function() {
  return this.offsetHeight;
}
$dynamic("get$_offsetLeft").Element = function() {
  return this.offsetLeft;
}
$dynamic("get$_offsetTop").Element = function() {
  return this.offsetTop;
}
$dynamic("get$_offsetWidth").Element = function() {
  return this.offsetWidth;
}
$dynamic("get$_scrollHeight").Element = function() {
  return this.scrollHeight;
}
$dynamic("get$_scrollLeft").Element = function() {
  return this.scrollLeft;
}
$dynamic("get$_scrollTop").Element = function() {
  return this.scrollTop;
}
$dynamic("get$_scrollWidth").Element = function() {
  return this.scrollWidth;
}
$dynamic("_getBoundingClientRect").Element = function() {
  return this.getBoundingClientRect();
}
$dynamic("_getClientRects").Element = function() {
  return this.getClientRects();
}
$dynamic("query").Element = function(selectors) {
  return this.querySelector(selectors);
}
// ********** Code for _HTMLElementImpl **************
// ********** Code for _AbstractWorkerImpl **************
$dynamic("_addEventListener").AbstractWorker = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _AnchorElementImpl **************
$dynamic("is$html_Element").HTMLAnchorElement = function(){return true};
$dynamic("assert$html_Element").HTMLAnchorElement = function(){return this};
$dynamic("assert$html_Node").HTMLAnchorElement = function(){return this};
// ********** Code for _AnimationImpl **************
// ********** Code for _EventImpl **************
// ********** Code for _AnimationEventImpl **************
// ********** Code for _AnimationListImpl **************
// ********** Code for _AppletElementImpl **************
$dynamic("is$html_Element").HTMLAppletElement = function(){return true};
$dynamic("assert$html_Element").HTMLAppletElement = function(){return this};
$dynamic("assert$html_Node").HTMLAppletElement = function(){return this};
// ********** Code for _AreaElementImpl **************
$dynamic("is$html_Element").HTMLAreaElement = function(){return true};
$dynamic("assert$html_Element").HTMLAreaElement = function(){return this};
$dynamic("assert$html_Node").HTMLAreaElement = function(){return this};
// ********** Code for _ArrayBufferImpl **************
// ********** Code for _ArrayBufferViewImpl **************
// ********** Code for _AttrImpl **************
$dynamic("assert$html_Node").Attr = function(){return this};
// ********** Code for _AudioBufferImpl **************
// ********** Code for _AudioNodeImpl **************
// ********** Code for _AudioSourceNodeImpl **************
// ********** Code for _AudioBufferSourceNodeImpl **************
// ********** Code for _AudioChannelMergerImpl **************
// ********** Code for _AudioChannelSplitterImpl **************
// ********** Code for _AudioContextImpl **************
// ********** Code for _AudioDestinationNodeImpl **************
// ********** Code for _MediaElementImpl **************
$dynamic("is$html_Element").HTMLMediaElement = function(){return true};
$dynamic("assert$html_Element").HTMLMediaElement = function(){return this};
$dynamic("assert$html_Node").HTMLMediaElement = function(){return this};
// ********** Code for _AudioElementImpl **************
$dynamic("is$html_Element").HTMLAudioElement = function(){return true};
$dynamic("assert$html_Element").HTMLAudioElement = function(){return this};
$dynamic("assert$html_Node").HTMLAudioElement = function(){return this};
// ********** Code for _AudioParamImpl **************
// ********** Code for _AudioGainImpl **************
// ********** Code for _AudioGainNodeImpl **************
// ********** Code for _AudioListenerImpl **************
// ********** Code for _AudioPannerNodeImpl **************
// ********** Code for _AudioProcessingEventImpl **************
// ********** Code for _BRElementImpl **************
$dynamic("is$html_Element").HTMLBRElement = function(){return true};
$dynamic("assert$html_Element").HTMLBRElement = function(){return this};
$dynamic("assert$html_Node").HTMLBRElement = function(){return this};
// ********** Code for _BarInfoImpl **************
// ********** Code for _BaseElementImpl **************
$dynamic("is$html_Element").HTMLBaseElement = function(){return true};
$dynamic("assert$html_Element").HTMLBaseElement = function(){return this};
$dynamic("assert$html_Node").HTMLBaseElement = function(){return this};
// ********** Code for _BaseFontElementImpl **************
$dynamic("is$html_Element").HTMLBaseFontElement = function(){return true};
$dynamic("assert$html_Element").HTMLBaseFontElement = function(){return this};
$dynamic("assert$html_Node").HTMLBaseFontElement = function(){return this};
// ********** Code for _BeforeLoadEventImpl **************
// ********** Code for _BiquadFilterNodeImpl **************
// ********** Code for _BlobImpl **************
// ********** Code for _BlobBuilderImpl **************
// ********** Code for _BodyElementImpl **************
$dynamic("is$html_Element").HTMLBodyElement = function(){return true};
$dynamic("assert$html_Element").HTMLBodyElement = function(){return this};
$dynamic("assert$html_Node").HTMLBodyElement = function(){return this};
$dynamic("get$on").HTMLBodyElement = function() {
  return new _BodyElementEventsImpl(this);
}
// ********** Code for _EventsImpl **************
function _EventsImpl(_ptr) {
  this._ptr = _ptr;
}
_EventsImpl.prototype._get = function(type) {
  return new _EventListenerListImpl(this._ptr, type);
}
// ********** Code for _ElementEventsImpl **************
$inherits(_ElementEventsImpl, _EventsImpl);
function _ElementEventsImpl(_ptr) {
  _EventsImpl.call(this, _ptr);
}
_ElementEventsImpl.prototype.get$mouseDown = function() {
  return this._get("mousedown");
}
_ElementEventsImpl.prototype.get$touchStart = function() {
  return this._get("touchstart");
}
// ********** Code for _BodyElementEventsImpl **************
$inherits(_BodyElementEventsImpl, _ElementEventsImpl);
function _BodyElementEventsImpl(_ptr) {
  _ElementEventsImpl.call(this, _ptr);
}
// ********** Code for _ButtonElementImpl **************
$dynamic("is$html_Element").HTMLButtonElement = function(){return true};
$dynamic("assert$html_Element").HTMLButtonElement = function(){return this};
$dynamic("assert$html_Node").HTMLButtonElement = function(){return this};
// ********** Code for _CharacterDataImpl **************
$dynamic("assert$html_Node").CharacterData = function(){return this};
// ********** Code for _TextImpl **************
$dynamic("assert$html_Node").Text = function(){return this};
// ********** Code for _CDATASectionImpl **************
$dynamic("assert$html_Node").CDATASection = function(){return this};
// ********** Code for _CSSRuleImpl **************
// ********** Code for _CSSCharsetRuleImpl **************
// ********** Code for _CSSFontFaceRuleImpl **************
// ********** Code for _CSSImportRuleImpl **************
// ********** Code for _CSSKeyframeRuleImpl **************
// ********** Code for _CSSKeyframesRuleImpl **************
// ********** Code for _CSSMatrixImpl **************
// ********** Code for _CSSMediaRuleImpl **************
// ********** Code for _CSSPageRuleImpl **************
// ********** Code for _CSSValueImpl **************
// ********** Code for _CSSPrimitiveValueImpl **************
// ********** Code for _CSSRuleListImpl **************
// ********** Code for _CSSStyleDeclarationImpl **************
$dynamic("assert$html_CSSStyleDeclaration").CSSStyleDeclaration = function(){return this};
$dynamic("get$left").CSSStyleDeclaration = function() {
  return this.getPropertyValue("left");
}
$dynamic("get$top").CSSStyleDeclaration = function() {
  return this.getPropertyValue("top");
}
// ********** Code for _CSSStyleRuleImpl **************
// ********** Code for _StyleSheetImpl **************
$dynamic("assert$html_StyleSheet").StyleSheet = function(){return this};
// ********** Code for _CSSStyleSheetImpl **************
$dynamic("assert$html_StyleSheet").CSSStyleSheet = function(){return this};
// ********** Code for _CSSValueListImpl **************
// ********** Code for _CSSTransformValueImpl **************
// ********** Code for _CSSUnknownRuleImpl **************
// ********** Code for _CanvasElementImpl **************
$dynamic("assert$CanvasElement").HTMLCanvasElement = function(){return this};
$dynamic("is$html_Element").HTMLCanvasElement = function(){return true};
$dynamic("assert$html_Element").HTMLCanvasElement = function(){return this};
$dynamic("assert$html_Node").HTMLCanvasElement = function(){return this};
// ********** Code for _CanvasGradientImpl **************
// ********** Code for _CanvasPatternImpl **************
// ********** Code for _CanvasPixelArrayImpl **************
$dynamic("is$List").CanvasPixelArray = function(){return true};
$dynamic("assert$List").CanvasPixelArray = function(){return this};
$dynamic("assert$List_Element").CanvasPixelArray = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
$dynamic("is$Collection").CanvasPixelArray = function(){return true};
$dynamic("assert$Collection").CanvasPixelArray = function(){return this};
$dynamic("assert$Collection_Firework").CanvasPixelArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
$dynamic("assert$Collection_Spark").CanvasPixelArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
$dynamic("assert$Collection_dart_core_Function").CanvasPixelArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
$dynamic("assert$Collection_Future").CanvasPixelArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
$dynamic("assert$Collection_Object").CanvasPixelArray = function(){return this};
$dynamic("assert$Collection_String").CanvasPixelArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
$dynamic("assert$Collection_int").CanvasPixelArray = function(){return this};
$dynamic("assert$Collection_num").CanvasPixelArray = function(){return this};
$dynamic("assert$Collection_ClientRect").CanvasPixelArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
$dynamic("assert$Collection_Element").CanvasPixelArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
$dynamic("assert$Collection_Node").CanvasPixelArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Node>"))};
$dynamic("assert$Collection_StyleSheet").CanvasPixelArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
$dynamic("assert$Collection_TimeoutHandler").CanvasPixelArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
$dynamic("assert$Collection_Touch").CanvasPixelArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
$dynamic("assert$Collection__MeasurementRequest").CanvasPixelArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
$dynamic("assert$Collection__NodeImpl").CanvasPixelArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
$dynamic("assert$Iterable").CanvasPixelArray = function(){return this};
$dynamic("get$length").CanvasPixelArray = function() { return this.length; };
$dynamic("$index").CanvasPixelArray = function(index) {
  return this[index];
}
$dynamic("$setindex").CanvasPixelArray = function(index, value) {
  this[index] = value
}
$dynamic("iterator").CanvasPixelArray = function() {
  return new _FixedSizeListIterator_int(this);
}
$dynamic("add").CanvasPixelArray = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addLast").CanvasPixelArray = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addAll").CanvasPixelArray = function(collection) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("forEach").CanvasPixelArray = function(f) {
  return _Collections.forEach(this, f);
}
$dynamic("filter").CanvasPixelArray = function(f) {
  return _Collections.filter(this, [], f);
}
$dynamic("isEmpty").CanvasPixelArray = function() {
  return this.length == (0);
}
$dynamic("last").CanvasPixelArray = function() {
  return this.$index(this.length - (1));
}
$dynamic("removeRange").CanvasPixelArray = function(start, length) {
  $throw(new UnsupportedOperationException("Cannot removeRange on immutable List."));
}
$dynamic("getRange").CanvasPixelArray = function(start, length) {
  return _Lists.getRange(this, start, length, []);
}
$dynamic("add$1").CanvasPixelArray = function($0) {
  return this.add($assert_num($0));
};
$dynamic("addAll$1").CanvasPixelArray = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_int()));
};
$dynamic("addLast$1").CanvasPixelArray = function($0) {
  return this.addLast($assert_num($0));
};
$dynamic("forEach$1").CanvasPixelArray = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _CanvasRenderingContextImpl **************
// ********** Code for _CanvasRenderingContext2DImpl **************
$dynamic("assert$html_CanvasRenderingContext2D").CanvasRenderingContext2D = function(){return this};
// ********** Code for _ClientRectImpl **************
$dynamic("assert$html_ClientRect").ClientRect = function(){return this};
$dynamic("get$left").ClientRect = function() { return this.left; };
$dynamic("get$top").ClientRect = function() { return this.top; };
// ********** Code for _ClientRectListImpl **************
// ********** Code for _ClipboardImpl **************
// ********** Code for _CloseEventImpl **************
// ********** Code for _CommentImpl **************
$dynamic("assert$html_Node").Comment = function(){return this};
// ********** Code for _UIEventImpl **************
// ********** Code for _CompositionEventImpl **************
// ********** Code for _ConsoleImpl **************
_ConsoleImpl = (typeof console == 'undefined' ? {} : console);
// ********** Code for _ContentElementImpl **************
$dynamic("is$html_Element").HTMLContentElement = function(){return true};
$dynamic("assert$html_Element").HTMLContentElement = function(){return this};
$dynamic("assert$html_Node").HTMLContentElement = function(){return this};
// ********** Code for _ConvolverNodeImpl **************
// ********** Code for _CoordinatesImpl **************
// ********** Code for _CounterImpl **************
// ********** Code for _CryptoImpl **************
// ********** Code for _CustomEventImpl **************
// ********** Code for _DListElementImpl **************
$dynamic("is$html_Element").HTMLDListElement = function(){return true};
$dynamic("assert$html_Element").HTMLDListElement = function(){return this};
$dynamic("assert$html_Node").HTMLDListElement = function(){return this};
// ********** Code for _DOMApplicationCacheImpl **************
$dynamic("_addEventListener").DOMApplicationCache = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _DOMExceptionImpl **************
// ********** Code for _DOMFileSystemImpl **************
// ********** Code for _DOMFileSystemSyncImpl **************
// ********** Code for _DOMFormDataImpl **************
// ********** Code for _DOMImplementationImpl **************
// ********** Code for _DOMMimeTypeImpl **************
// ********** Code for _DOMMimeTypeArrayImpl **************
// ********** Code for _DOMParserImpl **************
// ********** Code for _DOMPluginImpl **************
// ********** Code for _DOMPluginArrayImpl **************
// ********** Code for _DOMSelectionImpl **************
// ********** Code for _DOMTokenListImpl **************
$dynamic("add$1").DOMTokenList = function($0) {
  return this.add($assert_String($0));
};
// ********** Code for _DOMSettableTokenListImpl **************
// ********** Code for _DOMURLImpl **************
// ********** Code for _DataTransferItemImpl **************
// ********** Code for _DataTransferItemListImpl **************
$dynamic("add$1").DataTransferItemList = function($0) {
  return this.add($0);
};
$dynamic("clear$0").DataTransferItemList = function() {
  return this.clear();
};
// ********** Code for _DataViewImpl **************
// ********** Code for _DatabaseImpl **************
// ********** Code for _DatabaseSyncImpl **************
// ********** Code for _WorkerContextImpl **************
// ********** Code for _DedicatedWorkerContextImpl **************
// ********** Code for _DelayNodeImpl **************
// ********** Code for _DeprecatedPeerConnectionImpl **************
// ********** Code for _DetailsElementImpl **************
$dynamic("is$html_Element").HTMLDetailsElement = function(){return true};
$dynamic("assert$html_Element").HTMLDetailsElement = function(){return this};
$dynamic("assert$html_Node").HTMLDetailsElement = function(){return this};
// ********** Code for _DeviceMotionEventImpl **************
// ********** Code for _DeviceOrientationEventImpl **************
// ********** Code for _DirectoryElementImpl **************
$dynamic("is$html_Element").HTMLDirectoryElement = function(){return true};
$dynamic("assert$html_Element").HTMLDirectoryElement = function(){return this};
$dynamic("assert$html_Node").HTMLDirectoryElement = function(){return this};
// ********** Code for _EntryImpl **************
// ********** Code for _DirectoryEntryImpl **************
// ********** Code for _EntrySyncImpl **************
$dynamic("remove$0").EntrySync = function() {
  return this.remove();
};
// ********** Code for _DirectoryEntrySyncImpl **************
// ********** Code for _DirectoryReaderImpl **************
// ********** Code for _DirectoryReaderSyncImpl **************
// ********** Code for _DivElementImpl **************
$dynamic("is$html_Element").HTMLDivElement = function(){return true};
$dynamic("assert$html_Element").HTMLDivElement = function(){return this};
$dynamic("assert$html_Node").HTMLDivElement = function(){return this};
// ********** Code for _DocumentImpl **************
$dynamic("is$html_Element").HTMLHtmlElement = function(){return true};
$dynamic("assert$html_Element").HTMLHtmlElement = function(){return this};
$dynamic("assert$html_Node").HTMLHtmlElement = function(){return this};
$dynamic("get$on").HTMLHtmlElement = function() {
  return new _DocumentEventsImpl(this.get$_jsDocument());
}
$dynamic("_createElement").HTMLHtmlElement = function(tagName) {
  return this.parentNode.createElement(tagName);
}
$dynamic("get$_jsDocument").HTMLHtmlElement = function() {
  return this.parentNode;
}
$dynamic("get$parent").HTMLHtmlElement = function() {
  return null;
}
// ********** Code for _SecretHtmlDocumentImpl **************
$dynamic("assert$html_Node").HTMLDocument = function(){return this};
// ********** Code for _DocumentEventsImpl **************
$inherits(_DocumentEventsImpl, _ElementEventsImpl);
function _DocumentEventsImpl(_ptr) {
  _ElementEventsImpl.call(this, _ptr);
}
_DocumentEventsImpl.prototype.get$mouseDown = function() {
  return this._get("mousedown");
}
_DocumentEventsImpl.prototype.get$touchStart = function() {
  return this._get("touchstart");
}
// ********** Code for FilteredElementList **************
function FilteredElementList(node) {
  this._childNodes = node.get$nodes();
  this._node = node;
}
FilteredElementList.prototype.assert$ElementList = function(){return this};
FilteredElementList.prototype.is$List = function(){return true};
FilteredElementList.prototype.assert$List = function(){return this};
FilteredElementList.prototype.assert$List_Element = function(){return this};
FilteredElementList.prototype.is$Collection = function(){return true};
FilteredElementList.prototype.assert$Collection = function(){return this};
FilteredElementList.prototype.assert$Collection_Firework = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
FilteredElementList.prototype.assert$Collection_Spark = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
FilteredElementList.prototype.assert$Collection_dart_core_Function = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
FilteredElementList.prototype.assert$Collection_Future = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
FilteredElementList.prototype.assert$Collection_Object = function(){return this};
FilteredElementList.prototype.assert$Collection_String = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
FilteredElementList.prototype.assert$Collection_int = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.int>"))};
FilteredElementList.prototype.assert$Collection_num = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.num>"))};
FilteredElementList.prototype.assert$Collection_ClientRect = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
FilteredElementList.prototype.assert$Collection_Element = function(){return this};
FilteredElementList.prototype.assert$Collection_Node = function(){return this};
FilteredElementList.prototype.assert$Collection_StyleSheet = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
FilteredElementList.prototype.assert$Collection_TimeoutHandler = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
FilteredElementList.prototype.assert$Collection_Touch = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
FilteredElementList.prototype.assert$Collection__MeasurementRequest = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
FilteredElementList.prototype.assert$Collection__NodeImpl = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
FilteredElementList.prototype.assert$Iterable = function(){return this};
FilteredElementList.prototype.get$_filtered = function() {
  var $0;
  return ListFactory.ListFactory$from$factory((($0 = this._childNodes.filter((function (n) {
    return !!(n && n.is$html_Element());
  })
  )) == null ? null : $0.assert$Iterable()));
}
FilteredElementList.prototype.get$first = function() {
  var $$list = this._childNodes;
  for (var $$i = $$list.iterator(); $$i.hasNext(); ) {
    var node = $$i.next();
    if (!!(node && node.is$html_Element())) {
      return (node == null ? null : node.assert$html_Element());
    }
  }
  return null;
}
FilteredElementList.prototype.forEach = function(f) {
  this.get$_filtered().forEach(f);
}
FilteredElementList.prototype.$setindex = function(index, value) {
  this.$index(index).replaceWith(value);
}
FilteredElementList.prototype.add = function(value) {
  this._childNodes.add$1(value);
}
FilteredElementList.prototype.get$add = function() {
  return this.add.bind(this);
}
Function.prototype.bind = Function.prototype.bind ||
  function(thisObj) {
    var func = this;
    var funcLength = func.$length || func.length;
    var argsLength = arguments.length;
    if (argsLength > 1) {
      var boundArgs = Array.prototype.slice.call(arguments, 1);
      var bound = function() {
        // Prepend the bound arguments to the current arguments.
        var newArgs = Array.prototype.slice.call(arguments);
        Array.prototype.unshift.apply(newArgs, boundArgs);
        return func.apply(thisObj, newArgs);
      };
      bound.$length = Math.max(0, funcLength - (argsLength - 1));
      return bound;
    } else {
      var bound = function() {
        return func.apply(thisObj, arguments);
      };
      bound.$length = funcLength;
      return bound;
    }
  };
FilteredElementList.prototype.addAll = function(collection) {
  collection.forEach(this.get$add());
}
FilteredElementList.prototype.addLast = function(value) {
  this.add(value);
}
FilteredElementList.prototype.removeRange = function(start, length) {
  this.get$_filtered().getRange(start, length).forEach$1((function (el) {
    return el.remove$0();
  })
  );
}
FilteredElementList.prototype.clear = function() {
  this._childNodes.clear();
}
FilteredElementList.prototype.removeLast = function() {
  var last = this.last();
  if ($ne$(last)) {
    last.remove$0();
  }
  return (last == null ? null : last.assert$html_Element());
}
FilteredElementList.prototype.filter = function(f) {
  var $0;
  return (($0 = this.get$_filtered().filter(f)) == null ? null : $0.assert$Collection_Element());
}
FilteredElementList.prototype.isEmpty = function() {
  return this.get$_filtered().isEmpty();
}
FilteredElementList.prototype.get$length = function() {
  return this.get$_filtered().get$length();
}
FilteredElementList.prototype.$index = function(index) {
  var $0;
  return (($0 = this.get$_filtered().$index(index)) == null ? null : $0.assert$html_Element());
}
FilteredElementList.prototype.iterator = function() {
  var $0;
  return (($0 = this.get$_filtered().iterator()) == null ? null : $0.assert$Iterator_Element());
}
FilteredElementList.prototype.getRange = function(start, length) {
  return this.get$_filtered().getRange(start, length);
}
FilteredElementList.prototype.last = function() {
  return this.get$_filtered().last();
}
FilteredElementList.prototype.add$1 = function($0) {
  return this.add(($0 == null ? null : $0.assert$html_Element()));
};
FilteredElementList.prototype.addAll$1 = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_Element()));
};
FilteredElementList.prototype.addLast$1 = function($0) {
  return this.addLast(($0 == null ? null : $0.assert$html_Element()));
};
FilteredElementList.prototype.clear$0 = FilteredElementList.prototype.clear;
FilteredElementList.prototype.forEach$1 = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for EmptyElementRect **************
function EmptyElementRect() {
  this.client = const$0006;
  this.offset = const$0006;
  this.scroll = const$0006;
  this.bounding = const$0006;
  this.clientRects = const$0008;
}
EmptyElementRect.prototype.assert$ElementRect = function(){return this};
EmptyElementRect.prototype.get$bounding = function() { return this.bounding; };
// ********** Code for _DocumentFragmentImpl **************
$dynamic("is$html_Element").DocumentFragment = function(){return true};
$dynamic("assert$html_Element").DocumentFragment = function(){return this};
$dynamic("assert$html_Node").DocumentFragment = function(){return this};
$dynamic("get$elements").DocumentFragment = function() {
  if (this._elements == null) {
    this._elements = new FilteredElementList(this);
  }
  return this._elements;
}
$dynamic("set$innerHTML").DocumentFragment = function(value) {
  this.get$nodes().clear();
  var e = _ElementFactoryProvider.Element$tag$factory("div");
  e.set$innerHTML(value);
  var nodes = ListFactory.ListFactory$from$factory(e.get$nodes());
  this.get$nodes().addAll(nodes);
}
$dynamic("get$rect").DocumentFragment = function() {
  return _createMeasurementFuture((function () {
    return const$0009;
  })
  , new CompleterImpl_ElementRect());
}
$dynamic("get$parent").DocumentFragment = function() {
  return null;
}
$dynamic("get$on").DocumentFragment = function() {
  return new _ElementEventsImpl(this);
}
$dynamic("query").DocumentFragment = function(selectors) {
  return this.querySelector(selectors);
}
// ********** Code for _DocumentTypeImpl **************
$dynamic("assert$html_Node").DocumentType = function(){return this};
// ********** Code for _DynamicsCompressorNodeImpl **************
// ********** Code for _EXTTextureFilterAnisotropicImpl **************
// ********** Code for _ChildrenElementList **************
_ChildrenElementList._wrap$ctor = function(element) {
  this._childElements = element.get$_children();
  this._html_element = element;
}
_ChildrenElementList._wrap$ctor.prototype = _ChildrenElementList.prototype;
function _ChildrenElementList() {}
_ChildrenElementList.prototype.assert$ElementList = function(){return this};
_ChildrenElementList.prototype.is$List = function(){return true};
_ChildrenElementList.prototype.assert$List = function(){return this};
_ChildrenElementList.prototype.assert$List_Element = function(){return this};
_ChildrenElementList.prototype.is$Collection = function(){return true};
_ChildrenElementList.prototype.assert$Collection = function(){return this};
_ChildrenElementList.prototype.assert$Collection_Firework = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
_ChildrenElementList.prototype.assert$Collection_Spark = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
_ChildrenElementList.prototype.assert$Collection_dart_core_Function = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
_ChildrenElementList.prototype.assert$Collection_Future = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
_ChildrenElementList.prototype.assert$Collection_Object = function(){return this};
_ChildrenElementList.prototype.assert$Collection_String = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
_ChildrenElementList.prototype.assert$Collection_int = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.int>"))};
_ChildrenElementList.prototype.assert$Collection_num = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.num>"))};
_ChildrenElementList.prototype.assert$Collection_ClientRect = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
_ChildrenElementList.prototype.assert$Collection_Element = function(){return this};
_ChildrenElementList.prototype.assert$Collection_Node = function(){return this};
_ChildrenElementList.prototype.assert$Collection_StyleSheet = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
_ChildrenElementList.prototype.assert$Collection_TimeoutHandler = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
_ChildrenElementList.prototype.assert$Collection_Touch = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
_ChildrenElementList.prototype.assert$Collection__MeasurementRequest = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
_ChildrenElementList.prototype.assert$Collection__NodeImpl = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
_ChildrenElementList.prototype.assert$Iterable = function(){return this};
_ChildrenElementList.prototype._toList = function() {
  var output = new Array(this._childElements.get$length());
  for (var i = (0), len = this._childElements.get$length();
   i < len; i++) {
    output.$setindex(i, this._childElements.$index(i));
  }
  return (output == null ? null : output.assert$List_Element());
}
_ChildrenElementList.prototype.get$first = function() {
  return this._html_element.get$_firstElementChild();
}
_ChildrenElementList.prototype.forEach = function(f) {
  var $$list = this._childElements;
  for (var $$i = $$list.iterator(); $$i.hasNext(); ) {
    var element = $$i.next();
    f(element);
  }
}
_ChildrenElementList.prototype.filter = function(f) {
  var output = [];
  this.forEach((function (element) {
    if (f(element)) {
      output.add$1(element);
    }
  })
  );
  return new _FrozenElementList._wrap$ctor(output);
}
_ChildrenElementList.prototype.isEmpty = function() {
  return this._html_element.get$_firstElementChild() == null;
}
_ChildrenElementList.prototype.get$length = function() {
  return this._childElements.get$length();
}
_ChildrenElementList.prototype.$index = function(index) {
  var $0;
  return (($0 = this._childElements.$index(index)) == null ? null : $0.assert$_ElementImpl());
}
_ChildrenElementList.prototype.$setindex = function(index, value) {
  this._html_element._replaceChild(value, this._childElements.$index(index));
}
_ChildrenElementList.prototype.add = function(value) {
  this._html_element._appendChild(value);
  return value;
}
_ChildrenElementList.prototype.addLast = function(value) {
  return this.add(value);
}
_ChildrenElementList.prototype.iterator = function() {
  var $0;
  return (($0 = this._toList().iterator()) == null ? null : $0.assert$Iterator_Element());
}
_ChildrenElementList.prototype.addAll = function(collection) {
  for (var $$i = collection.iterator(); $$i.hasNext(); ) {
    var element = $$i.next();
    this._html_element._appendChild(element);
  }
}
_ChildrenElementList.prototype.removeRange = function(start, length) {
  $throw(const$0011);
}
_ChildrenElementList.prototype.getRange = function(start, length) {
  return new _FrozenElementList._wrap$ctor(_Lists.getRange(this, start, length, []));
}
_ChildrenElementList.prototype.clear = function() {
  this._html_element.set$text("");
}
_ChildrenElementList.prototype.removeLast = function() {
  var last = this.last();
  if ($ne$(last)) {
    this._html_element._removeChild((last == null ? null : last.assert$_NodeImpl()));
  }
  return (last == null ? null : last.assert$html_Element());
}
_ChildrenElementList.prototype.last = function() {
  return this._html_element.lastElementChild;
}
_ChildrenElementList.prototype.add$1 = function($0) {
  return this.add(($0 == null ? null : $0.assert$_ElementImpl()));
};
_ChildrenElementList.prototype.addAll$1 = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_Element()));
};
_ChildrenElementList.prototype.addLast$1 = function($0) {
  return this.addLast(($0 == null ? null : $0.assert$_ElementImpl()));
};
_ChildrenElementList.prototype.clear$0 = _ChildrenElementList.prototype.clear;
_ChildrenElementList.prototype.forEach$1 = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _FrozenElementList **************
_FrozenElementList._wrap$ctor = function(_nodeList) {
  this._nodeList = _nodeList;
}
_FrozenElementList._wrap$ctor.prototype = _FrozenElementList.prototype;
function _FrozenElementList() {}
_FrozenElementList.prototype.assert$ElementList = function(){return this};
_FrozenElementList.prototype.is$List = function(){return true};
_FrozenElementList.prototype.assert$List = function(){return this};
_FrozenElementList.prototype.assert$List_Element = function(){return this};
_FrozenElementList.prototype.is$Collection = function(){return true};
_FrozenElementList.prototype.assert$Collection = function(){return this};
_FrozenElementList.prototype.assert$Collection_Firework = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
_FrozenElementList.prototype.assert$Collection_Spark = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
_FrozenElementList.prototype.assert$Collection_dart_core_Function = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
_FrozenElementList.prototype.assert$Collection_Future = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
_FrozenElementList.prototype.assert$Collection_Object = function(){return this};
_FrozenElementList.prototype.assert$Collection_String = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
_FrozenElementList.prototype.assert$Collection_int = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.int>"))};
_FrozenElementList.prototype.assert$Collection_num = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.num>"))};
_FrozenElementList.prototype.assert$Collection_ClientRect = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
_FrozenElementList.prototype.assert$Collection_Element = function(){return this};
_FrozenElementList.prototype.assert$Collection_Node = function(){return this};
_FrozenElementList.prototype.assert$Collection_StyleSheet = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
_FrozenElementList.prototype.assert$Collection_TimeoutHandler = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
_FrozenElementList.prototype.assert$Collection_Touch = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
_FrozenElementList.prototype.assert$Collection__MeasurementRequest = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
_FrozenElementList.prototype.assert$Collection__NodeImpl = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
_FrozenElementList.prototype.assert$Iterable = function(){return this};
_FrozenElementList.prototype.get$first = function() {
  var $0;
  return (($0 = this._nodeList.$index((0))) == null ? null : $0.assert$html_Element());
}
_FrozenElementList.prototype.forEach = function(f) {
  for (var $$i = this.iterator(); $$i.hasNext(); ) {
    var el = $$i.next();
    f(el);
  }
}
_FrozenElementList.prototype.filter = function(f) {
  var out = new _ElementList([]);
  for (var $$i = this.iterator(); $$i.hasNext(); ) {
    var el = $$i.next();
    if (f(el)) out.add$1(el);
  }
  return (out == null ? null : out.assert$ElementList());
}
_FrozenElementList.prototype.isEmpty = function() {
  return this._nodeList.isEmpty();
}
_FrozenElementList.prototype.get$length = function() {
  return this._nodeList.get$length();
}
_FrozenElementList.prototype.$index = function(index) {
  var $0;
  return (($0 = this._nodeList.$index(index)) == null ? null : $0.assert$html_Element());
}
_FrozenElementList.prototype.$setindex = function(index, value) {
  $throw(const$0003);
}
_FrozenElementList.prototype.add = function(value) {
  $throw(const$0003);
}
_FrozenElementList.prototype.addLast = function(value) {
  $throw(const$0003);
}
_FrozenElementList.prototype.iterator = function() {
  return new _FrozenElementListIterator(this);
}
_FrozenElementList.prototype.addAll = function(collection) {
  $throw(const$0003);
}
_FrozenElementList.prototype.removeRange = function(start, length) {
  $throw(const$0003);
}
_FrozenElementList.prototype.getRange = function(start, length) {
  return new _FrozenElementList._wrap$ctor(this._nodeList.getRange(start, length));
}
_FrozenElementList.prototype.clear = function() {
  $throw(const$0003);
}
_FrozenElementList.prototype.removeLast = function() {
  $throw(const$0003);
}
_FrozenElementList.prototype.last = function() {
  var $0;
  return (($0 = this._nodeList.last()) == null ? null : $0.assert$html_Element());
}
_FrozenElementList.prototype.add$1 = function($0) {
  return this.add(($0 == null ? null : $0.assert$html_Element()));
};
_FrozenElementList.prototype.addAll$1 = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_Element()));
};
_FrozenElementList.prototype.addLast$1 = function($0) {
  return this.addLast(($0 == null ? null : $0.assert$html_Element()));
};
_FrozenElementList.prototype.clear$0 = _FrozenElementList.prototype.clear;
_FrozenElementList.prototype.forEach$1 = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _FrozenElementListIterator **************
function _FrozenElementListIterator(_list) {
  this._html_index = (0);
  this._html_list = _list;
}
_FrozenElementListIterator.prototype.assert$Iterator = function(){return this};
_FrozenElementListIterator.prototype.assert$Iterator_Element = function(){return this};
_FrozenElementListIterator.prototype.next = function() {
  if (!this.hasNext()) {
    $throw(const$0001);
  }
  return this._html_list.$index(this._html_index++);
}
_FrozenElementListIterator.prototype.hasNext = function() {
  return this._html_index < this._html_list.get$length();
}
// ********** Code for _ListWrapper **************
function _ListWrapper() {}
_ListWrapper.prototype.is$List = function(){return true};
_ListWrapper.prototype.assert$List = function(){return this};
_ListWrapper.prototype.assert$List_Element = function(){return this};
_ListWrapper.prototype.is$Collection = function(){return true};
_ListWrapper.prototype.assert$Collection = function(){return this};
_ListWrapper.prototype.assert$Collection_Firework = function(){return this};
_ListWrapper.prototype.assert$Collection_Spark = function(){return this};
_ListWrapper.prototype.assert$Collection_dart_core_Function = function(){return this};
_ListWrapper.prototype.assert$Collection_Future = function(){return this};
_ListWrapper.prototype.assert$Collection_Object = function(){return this};
_ListWrapper.prototype.assert$Collection_String = function(){return this};
_ListWrapper.prototype.assert$Collection_int = function(){return this};
_ListWrapper.prototype.assert$Collection_num = function(){return this};
_ListWrapper.prototype.assert$Collection_ClientRect = function(){return this};
_ListWrapper.prototype.assert$Collection_Element = function(){return this};
_ListWrapper.prototype.assert$Collection_Node = function(){return this};
_ListWrapper.prototype.assert$Collection_StyleSheet = function(){return this};
_ListWrapper.prototype.assert$Collection_TimeoutHandler = function(){return this};
_ListWrapper.prototype.assert$Collection_Touch = function(){return this};
_ListWrapper.prototype.assert$Collection__MeasurementRequest = function(){return this};
_ListWrapper.prototype.assert$Collection__NodeImpl = function(){return this};
_ListWrapper.prototype.assert$Iterable = function(){return this};
_ListWrapper.prototype.iterator = function() {
  var $0;
  return (($0 = this._html_list.iterator()) == null ? null : $0.assert$Iterator());
}
_ListWrapper.prototype.forEach = function(f) {
  return this._html_list.forEach(f);
}
_ListWrapper.prototype.filter = function(f) {
  var $0;
  return (($0 = this._html_list.filter(f)) == null ? null : $0.assert$List());
}
_ListWrapper.prototype.isEmpty = function() {
  return this._html_list.isEmpty();
}
_ListWrapper.prototype.get$length = function() {
  return this._html_list.get$length();
}
_ListWrapper.prototype.$index = function(index) {
  return this._html_list.$index(index);
}
_ListWrapper.prototype.$setindex = function(index, value) {
  this._html_list.$setindex(index, value);
}
_ListWrapper.prototype.add = function(value) {
  return $assert_void(this._html_list.add$1(value));
}
_ListWrapper.prototype.addLast = function(value) {
  return $assert_void(this._html_list.addLast$1(value));
}
_ListWrapper.prototype.addAll = function(collection) {
  return this._html_list.addAll(collection);
}
_ListWrapper.prototype.clear = function() {
  return this._html_list.clear();
}
_ListWrapper.prototype.removeLast = function() {
  return this._html_list.removeLast();
}
_ListWrapper.prototype.last = function() {
  return this._html_list.last();
}
_ListWrapper.prototype.getRange = function(start, length) {
  var $0;
  return (($0 = this._html_list.getRange(start, length)) == null ? null : $0.assert$List());
}
_ListWrapper.prototype.removeRange = function(start, length) {
  return this._html_list.removeRange(start, length);
}
_ListWrapper.prototype.get$first = function() {
  return this._html_list.$index((0));
}
_ListWrapper.prototype.add$1 = _ListWrapper.prototype.add;
_ListWrapper.prototype.addAll$1 = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection()));
};
_ListWrapper.prototype.addLast$1 = _ListWrapper.prototype.addLast;
_ListWrapper.prototype.clear$0 = _ListWrapper.prototype.clear;
_ListWrapper.prototype.forEach$1 = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _ListWrapper_Element **************
$inherits(_ListWrapper_Element, _ListWrapper);
function _ListWrapper_Element(_list) {
  this._html_list = _list;
}
_ListWrapper_Element.prototype.is$List = function(){return true};
_ListWrapper_Element.prototype.assert$List = function(){return this};
_ListWrapper_Element.prototype.assert$List_Element = function(){return this};
_ListWrapper_Element.prototype.is$Collection = function(){return true};
_ListWrapper_Element.prototype.assert$Collection = function(){return this};
_ListWrapper_Element.prototype.assert$Collection_Firework = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
_ListWrapper_Element.prototype.assert$Collection_Spark = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
_ListWrapper_Element.prototype.assert$Collection_dart_core_Function = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
_ListWrapper_Element.prototype.assert$Collection_Future = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
_ListWrapper_Element.prototype.assert$Collection_Object = function(){return this};
_ListWrapper_Element.prototype.assert$Collection_String = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
_ListWrapper_Element.prototype.assert$Collection_int = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.int>"))};
_ListWrapper_Element.prototype.assert$Collection_num = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.num>"))};
_ListWrapper_Element.prototype.assert$Collection_ClientRect = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
_ListWrapper_Element.prototype.assert$Collection_Element = function(){return this};
_ListWrapper_Element.prototype.assert$Collection_Node = function(){return this};
_ListWrapper_Element.prototype.assert$Collection_StyleSheet = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
_ListWrapper_Element.prototype.assert$Collection_TimeoutHandler = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
_ListWrapper_Element.prototype.assert$Collection_Touch = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
_ListWrapper_Element.prototype.assert$Collection__MeasurementRequest = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
_ListWrapper_Element.prototype.assert$Collection__NodeImpl = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
_ListWrapper_Element.prototype.assert$Iterable = function(){return this};
_ListWrapper_Element.prototype.add$1 = function($0) {
  return this.add(($0 == null ? null : $0.assert$html_Element()));
};
_ListWrapper_Element.prototype.addAll$1 = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_Element()));
};
_ListWrapper_Element.prototype.clear$0 = _ListWrapper_Element.prototype.clear;
_ListWrapper_Element.prototype.forEach$1 = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _ElementList **************
$inherits(_ElementList, _ListWrapper_Element);
function _ElementList(list) {
  _ListWrapper_Element.call(this, list);
}
_ElementList.prototype.assert$ElementList = function(){return this};
_ElementList.prototype.is$List = function(){return true};
_ElementList.prototype.assert$List = function(){return this};
_ElementList.prototype.assert$List_Element = function(){return this};
_ElementList.prototype.is$Collection = function(){return true};
_ElementList.prototype.assert$Collection = function(){return this};
_ElementList.prototype.assert$Collection_Firework = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
_ElementList.prototype.assert$Collection_Spark = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
_ElementList.prototype.assert$Collection_dart_core_Function = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
_ElementList.prototype.assert$Collection_Future = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
_ElementList.prototype.assert$Collection_Object = function(){return this};
_ElementList.prototype.assert$Collection_String = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
_ElementList.prototype.assert$Collection_int = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.int>"))};
_ElementList.prototype.assert$Collection_num = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.num>"))};
_ElementList.prototype.assert$Collection_ClientRect = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
_ElementList.prototype.assert$Collection_Element = function(){return this};
_ElementList.prototype.assert$Collection_Node = function(){return this};
_ElementList.prototype.assert$Collection_StyleSheet = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
_ElementList.prototype.assert$Collection_TimeoutHandler = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
_ElementList.prototype.assert$Collection_Touch = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
_ElementList.prototype.assert$Collection__MeasurementRequest = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
_ElementList.prototype.assert$Collection__NodeImpl = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
_ElementList.prototype.assert$Iterable = function(){return this};
_ElementList.prototype.filter = function(f) {
  return new _ElementList(_ListWrapper_Element.prototype.filter.call(this, f));
}
_ElementList.prototype.getRange = function(start, length) {
  return new _ElementList(_ListWrapper_Element.prototype.getRange.call(this, start, length));
}
// ********** Code for _SimpleClientRect **************
function _SimpleClientRect(left, top, width, height) {
  this.left = left;
  this.top = top;
  this.width = width;
  this.height = height;
}
_SimpleClientRect.prototype.assert$html_ClientRect = function(){return this};
_SimpleClientRect.prototype.get$left = function() { return this.left; };
_SimpleClientRect.prototype.get$top = function() { return this.top; };
_SimpleClientRect.prototype.$eq = function(other) {
  return null != other && this.left == other.left && this.top == other.top && this.width == other.width && this.height == other.height;
}
_SimpleClientRect.prototype.toString = function() {
  return ("(" + this.left + ", " + this.top + ", " + this.width + ", " + this.height + ")");
}
// ********** Code for _ElementRectImpl **************
function _ElementRectImpl(element) {
  this.client = new _SimpleClientRect(element.get$_clientLeft(), element.get$_clientTop(), element.get$_clientWidth(), element.get$_clientHeight());
  this.offset = new _SimpleClientRect(element.get$_offsetLeft(), element.get$_offsetTop(), element.get$_offsetWidth(), element.get$_offsetHeight());
  this.scroll = new _SimpleClientRect(element.get$_scrollLeft(), element.get$_scrollTop(), element.get$_scrollWidth(), element.get$_scrollHeight());
  this._boundingClientRect = element._getBoundingClientRect();
  this._clientRects = element._getClientRects();
}
_ElementRectImpl.prototype.assert$ElementRect = function(){return this};
_ElementRectImpl.prototype.get$bounding = function() {
  return this._boundingClientRect;
}
// ********** Code for _ElementTimeControlImpl **************
// ********** Code for _ElementTraversalImpl **************
// ********** Code for _EmbedElementImpl **************
$dynamic("is$html_Element").HTMLEmbedElement = function(){return true};
$dynamic("assert$html_Element").HTMLEmbedElement = function(){return this};
$dynamic("assert$html_Node").HTMLEmbedElement = function(){return this};
// ********** Code for _EntityImpl **************
$dynamic("assert$html_Node").Entity = function(){return this};
// ********** Code for _EntityReferenceImpl **************
$dynamic("assert$html_Node").EntityReference = function(){return this};
// ********** Code for _EntryArrayImpl **************
// ********** Code for _EntryArraySyncImpl **************
// ********** Code for _ErrorEventImpl **************
// ********** Code for _EventExceptionImpl **************
// ********** Code for _EventSourceImpl **************
$dynamic("_addEventListener").EventSource = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _EventListenerListImpl **************
function _EventListenerListImpl(_ptr, _type) {
  this._ptr = _ptr;
  this._type = _type;
}
_EventListenerListImpl.prototype.add = function(listener, useCapture) {
  this._add(listener, useCapture);
  return this;
}
_EventListenerListImpl.prototype._add = function(listener, useCapture) {
  this._ptr._addEventListener(this._type, listener, useCapture);
}
_EventListenerListImpl.prototype.add$1 = function($0) {
  return this.add(to$call$1($0), false);
};
// ********** Code for _FieldSetElementImpl **************
$dynamic("is$html_Element").HTMLFieldSetElement = function(){return true};
$dynamic("assert$html_Element").HTMLFieldSetElement = function(){return this};
$dynamic("assert$html_Node").HTMLFieldSetElement = function(){return this};
// ********** Code for _FileImpl **************
// ********** Code for _FileEntryImpl **************
// ********** Code for _FileEntrySyncImpl **************
// ********** Code for _FileErrorImpl **************
// ********** Code for _FileExceptionImpl **************
// ********** Code for _FileListImpl **************
// ********** Code for _FileReaderImpl **************
// ********** Code for _FileReaderSyncImpl **************
// ********** Code for _FileWriterImpl **************
// ********** Code for _FileWriterSyncImpl **************
// ********** Code for _Float32ArrayImpl **************
var _Float32ArrayImpl = {};
$dynamic("is$List").Float32Array = function(){return true};
$dynamic("assert$List").Float32Array = function(){return this};
$dynamic("assert$List_Element").Float32Array = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
$dynamic("is$Collection").Float32Array = function(){return true};
$dynamic("assert$Collection").Float32Array = function(){return this};
$dynamic("assert$Collection_Firework").Float32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
$dynamic("assert$Collection_Spark").Float32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
$dynamic("assert$Collection_dart_core_Function").Float32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
$dynamic("assert$Collection_Future").Float32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
$dynamic("assert$Collection_Object").Float32Array = function(){return this};
$dynamic("assert$Collection_String").Float32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
$dynamic("assert$Collection_int").Float32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.int>"))};
$dynamic("assert$Collection_num").Float32Array = function(){return this};
$dynamic("assert$Collection_ClientRect").Float32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
$dynamic("assert$Collection_Element").Float32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
$dynamic("assert$Collection_Node").Float32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Node>"))};
$dynamic("assert$Collection_StyleSheet").Float32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
$dynamic("assert$Collection_TimeoutHandler").Float32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
$dynamic("assert$Collection_Touch").Float32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
$dynamic("assert$Collection__MeasurementRequest").Float32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
$dynamic("assert$Collection__NodeImpl").Float32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
$dynamic("assert$Iterable").Float32Array = function(){return this};
$dynamic("get$length").Float32Array = function() { return this.length; };
$dynamic("$index").Float32Array = function(index) {
  return this[index];
}
$dynamic("$setindex").Float32Array = function(index, value) {
  this[index] = value
}
$dynamic("iterator").Float32Array = function() {
  return new _FixedSizeListIterator_num(this);
}
$dynamic("add").Float32Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addLast").Float32Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addAll").Float32Array = function(collection) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("forEach").Float32Array = function(f) {
  return _Collections.forEach(this, f);
}
$dynamic("filter").Float32Array = function(f) {
  return _Collections.filter(this, [], f);
}
$dynamic("isEmpty").Float32Array = function() {
  return this.length == (0);
}
$dynamic("last").Float32Array = function() {
  return this.$index(this.length - (1));
}
$dynamic("removeRange").Float32Array = function(start, length) {
  $throw(new UnsupportedOperationException("Cannot removeRange on immutable List."));
}
$dynamic("getRange").Float32Array = function(start, length) {
  return _Lists.getRange(this, start, length, []);
}
$dynamic("add$1").Float32Array = function($0) {
  return this.add($assert_num($0));
};
$dynamic("addAll$1").Float32Array = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_num()));
};
$dynamic("addLast$1").Float32Array = function($0) {
  return this.addLast($assert_num($0));
};
$dynamic("forEach$1").Float32Array = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _Float64ArrayImpl **************
var _Float64ArrayImpl = {};
$dynamic("is$List").Float64Array = function(){return true};
$dynamic("assert$List").Float64Array = function(){return this};
$dynamic("assert$List_Element").Float64Array = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
$dynamic("is$Collection").Float64Array = function(){return true};
$dynamic("assert$Collection").Float64Array = function(){return this};
$dynamic("assert$Collection_Firework").Float64Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
$dynamic("assert$Collection_Spark").Float64Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
$dynamic("assert$Collection_dart_core_Function").Float64Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
$dynamic("assert$Collection_Future").Float64Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
$dynamic("assert$Collection_Object").Float64Array = function(){return this};
$dynamic("assert$Collection_String").Float64Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
$dynamic("assert$Collection_int").Float64Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.int>"))};
$dynamic("assert$Collection_num").Float64Array = function(){return this};
$dynamic("assert$Collection_ClientRect").Float64Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
$dynamic("assert$Collection_Element").Float64Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
$dynamic("assert$Collection_Node").Float64Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Node>"))};
$dynamic("assert$Collection_StyleSheet").Float64Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
$dynamic("assert$Collection_TimeoutHandler").Float64Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
$dynamic("assert$Collection_Touch").Float64Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
$dynamic("assert$Collection__MeasurementRequest").Float64Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
$dynamic("assert$Collection__NodeImpl").Float64Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
$dynamic("assert$Iterable").Float64Array = function(){return this};
$dynamic("get$length").Float64Array = function() { return this.length; };
$dynamic("$index").Float64Array = function(index) {
  return this[index];
}
$dynamic("$setindex").Float64Array = function(index, value) {
  this[index] = value
}
$dynamic("iterator").Float64Array = function() {
  return new _FixedSizeListIterator_num(this);
}
$dynamic("add").Float64Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addLast").Float64Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addAll").Float64Array = function(collection) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("forEach").Float64Array = function(f) {
  return _Collections.forEach(this, f);
}
$dynamic("filter").Float64Array = function(f) {
  return _Collections.filter(this, [], f);
}
$dynamic("isEmpty").Float64Array = function() {
  return this.length == (0);
}
$dynamic("last").Float64Array = function() {
  return this.$index(this.length - (1));
}
$dynamic("removeRange").Float64Array = function(start, length) {
  $throw(new UnsupportedOperationException("Cannot removeRange on immutable List."));
}
$dynamic("getRange").Float64Array = function(start, length) {
  return _Lists.getRange(this, start, length, []);
}
$dynamic("add$1").Float64Array = function($0) {
  return this.add($assert_num($0));
};
$dynamic("addAll$1").Float64Array = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_num()));
};
$dynamic("addLast$1").Float64Array = function($0) {
  return this.addLast($assert_num($0));
};
$dynamic("forEach$1").Float64Array = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _FontElementImpl **************
$dynamic("is$html_Element").HTMLFontElement = function(){return true};
$dynamic("assert$html_Element").HTMLFontElement = function(){return this};
$dynamic("assert$html_Node").HTMLFontElement = function(){return this};
// ********** Code for _FormElementImpl **************
$dynamic("is$html_Element").HTMLFormElement = function(){return true};
$dynamic("assert$html_Element").HTMLFormElement = function(){return this};
$dynamic("assert$html_Node").HTMLFormElement = function(){return this};
// ********** Code for _FrameElementImpl **************
$dynamic("is$html_Element").HTMLFrameElement = function(){return true};
$dynamic("assert$html_Element").HTMLFrameElement = function(){return this};
$dynamic("assert$html_Node").HTMLFrameElement = function(){return this};
// ********** Code for _FrameSetElementImpl **************
$dynamic("is$html_Element").HTMLFrameSetElement = function(){return true};
$dynamic("assert$html_Element").HTMLFrameSetElement = function(){return this};
$dynamic("assert$html_Node").HTMLFrameSetElement = function(){return this};
$dynamic("get$on").HTMLFrameSetElement = function() {
  return new _FrameSetElementEventsImpl(this);
}
// ********** Code for _FrameSetElementEventsImpl **************
$inherits(_FrameSetElementEventsImpl, _ElementEventsImpl);
function _FrameSetElementEventsImpl(_ptr) {
  _ElementEventsImpl.call(this, _ptr);
}
// ********** Code for _GeolocationImpl **************
// ********** Code for _GeopositionImpl **************
// ********** Code for _HRElementImpl **************
$dynamic("is$html_Element").HTMLHRElement = function(){return true};
$dynamic("assert$html_Element").HTMLHRElement = function(){return this};
$dynamic("assert$html_Node").HTMLHRElement = function(){return this};
// ********** Code for _HTMLAllCollectionImpl **************
// ********** Code for _HTMLCollectionImpl **************
$dynamic("is$List").HTMLCollection = function(){return true};
$dynamic("assert$List").HTMLCollection = function(){return this};
$dynamic("assert$List_Element").HTMLCollection = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
$dynamic("is$Collection").HTMLCollection = function(){return true};
$dynamic("assert$Collection").HTMLCollection = function(){return this};
$dynamic("assert$Collection_Firework").HTMLCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
$dynamic("assert$Collection_Spark").HTMLCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
$dynamic("assert$Collection_dart_core_Function").HTMLCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
$dynamic("assert$Collection_Future").HTMLCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
$dynamic("assert$Collection_Object").HTMLCollection = function(){return this};
$dynamic("assert$Collection_String").HTMLCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
$dynamic("assert$Collection_int").HTMLCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.int>"))};
$dynamic("assert$Collection_num").HTMLCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.num>"))};
$dynamic("assert$Collection_ClientRect").HTMLCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
$dynamic("assert$Collection_Element").HTMLCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
$dynamic("assert$Collection_Node").HTMLCollection = function(){return this};
$dynamic("assert$Collection_StyleSheet").HTMLCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
$dynamic("assert$Collection_TimeoutHandler").HTMLCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
$dynamic("assert$Collection_Touch").HTMLCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
$dynamic("assert$Collection__MeasurementRequest").HTMLCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
$dynamic("assert$Collection__NodeImpl").HTMLCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
$dynamic("assert$Iterable").HTMLCollection = function(){return this};
$dynamic("get$length").HTMLCollection = function() { return this.length; };
$dynamic("$index").HTMLCollection = function(index) {
  return this[index];
}
$dynamic("$setindex").HTMLCollection = function(index, value) {
  $throw(new UnsupportedOperationException("Cannot assign element of immutable List."));
}
$dynamic("iterator").HTMLCollection = function() {
  return new _FixedSizeListIterator_html_Node(this);
}
$dynamic("add").HTMLCollection = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addLast").HTMLCollection = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addAll").HTMLCollection = function(collection) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("forEach").HTMLCollection = function(f) {
  return _Collections.forEach(this, f);
}
$dynamic("filter").HTMLCollection = function(f) {
  return _Collections.filter(this, [], f);
}
$dynamic("isEmpty").HTMLCollection = function() {
  return this.get$length() == (0);
}
$dynamic("last").HTMLCollection = function() {
  return this.$index(this.get$length() - (1));
}
$dynamic("removeRange").HTMLCollection = function(start, length) {
  $throw(new UnsupportedOperationException("Cannot removeRange on immutable List."));
}
$dynamic("getRange").HTMLCollection = function(start, length) {
  return _Lists.getRange(this, start, length, []);
}
$dynamic("add$1").HTMLCollection = function($0) {
  return this.add(($0 == null ? null : $0.assert$html_Node()));
};
$dynamic("addAll$1").HTMLCollection = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_Node()));
};
$dynamic("addLast$1").HTMLCollection = function($0) {
  return this.addLast(($0 == null ? null : $0.assert$html_Node()));
};
$dynamic("forEach$1").HTMLCollection = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _HTMLOptionsCollectionImpl **************
$dynamic("is$List").HTMLOptionsCollection = function(){return true};
$dynamic("assert$List").HTMLOptionsCollection = function(){return this};
$dynamic("assert$List_Element").HTMLOptionsCollection = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
$dynamic("is$Collection").HTMLOptionsCollection = function(){return true};
$dynamic("assert$Collection").HTMLOptionsCollection = function(){return this};
$dynamic("assert$Collection_Firework").HTMLOptionsCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
$dynamic("assert$Collection_Spark").HTMLOptionsCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
$dynamic("assert$Collection_dart_core_Function").HTMLOptionsCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
$dynamic("assert$Collection_Future").HTMLOptionsCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
$dynamic("assert$Collection_Object").HTMLOptionsCollection = function(){return this};
$dynamic("assert$Collection_String").HTMLOptionsCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
$dynamic("assert$Collection_int").HTMLOptionsCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.int>"))};
$dynamic("assert$Collection_num").HTMLOptionsCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.num>"))};
$dynamic("assert$Collection_ClientRect").HTMLOptionsCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
$dynamic("assert$Collection_Element").HTMLOptionsCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
$dynamic("assert$Collection_Node").HTMLOptionsCollection = function(){return this};
$dynamic("assert$Collection_StyleSheet").HTMLOptionsCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
$dynamic("assert$Collection_TimeoutHandler").HTMLOptionsCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
$dynamic("assert$Collection_Touch").HTMLOptionsCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
$dynamic("assert$Collection__MeasurementRequest").HTMLOptionsCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
$dynamic("assert$Collection__NodeImpl").HTMLOptionsCollection = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
$dynamic("assert$Iterable").HTMLOptionsCollection = function(){return this};
$dynamic("get$length").HTMLOptionsCollection = function() {
  return this.length;
}
// ********** Code for _HashChangeEventImpl **************
// ********** Code for _HeadElementImpl **************
$dynamic("is$html_Element").HTMLHeadElement = function(){return true};
$dynamic("assert$html_Element").HTMLHeadElement = function(){return this};
$dynamic("assert$html_Node").HTMLHeadElement = function(){return this};
// ********** Code for _HeadingElementImpl **************
$dynamic("is$html_Element").HTMLHeadingElement = function(){return true};
$dynamic("assert$html_Element").HTMLHeadingElement = function(){return this};
$dynamic("assert$html_Node").HTMLHeadingElement = function(){return this};
// ********** Code for _HighPass2FilterNodeImpl **************
// ********** Code for _HistoryImpl **************
// ********** Code for _HtmlElementImpl **************
$dynamic("is$html_Element").IntentionallyInvalid = function(){return true};
$dynamic("assert$html_Element").IntentionallyInvalid = function(){return this};
$dynamic("assert$html_Node").IntentionallyInvalid = function(){return this};
// ********** Code for _IDBAnyImpl **************
// ********** Code for _IDBCursorImpl **************
// ********** Code for _IDBCursorWithValueImpl **************
// ********** Code for _IDBDatabaseImpl **************
// ********** Code for _IDBDatabaseErrorImpl **************
// ********** Code for _IDBDatabaseExceptionImpl **************
// ********** Code for _IDBFactoryImpl **************
// ********** Code for _IDBIndexImpl **************
// ********** Code for _IDBKeyImpl **************
// ********** Code for _IDBKeyRangeImpl **************
// ********** Code for _IDBObjectStoreImpl **************
$dynamic("add$1").IDBObjectStore = function($0) {
  return this.add($0);
};
$dynamic("clear$0").IDBObjectStore = function() {
  return this.clear();
};
// ********** Code for _IDBRequestImpl **************
// ********** Code for _IDBTransactionImpl **************
// ********** Code for _IDBVersionChangeEventImpl **************
// ********** Code for _IDBVersionChangeRequestImpl **************
// ********** Code for _IFrameElementImpl **************
$dynamic("is$html_Element").HTMLIFrameElement = function(){return true};
$dynamic("assert$html_Element").HTMLIFrameElement = function(){return this};
$dynamic("assert$html_Node").HTMLIFrameElement = function(){return this};
// ********** Code for _ImageDataImpl **************
// ********** Code for _ImageElementImpl **************
$dynamic("is$html_Element").HTMLImageElement = function(){return true};
$dynamic("assert$html_Element").HTMLImageElement = function(){return this};
$dynamic("assert$html_Node").HTMLImageElement = function(){return this};
// ********** Code for _InputElementImpl **************
$dynamic("is$html_Element").HTMLInputElement = function(){return true};
$dynamic("assert$html_Element").HTMLInputElement = function(){return this};
$dynamic("assert$html_Node").HTMLInputElement = function(){return this};
$dynamic("get$on").HTMLInputElement = function() {
  return new _InputElementEventsImpl(this);
}
// ********** Code for _InputElementEventsImpl **************
$inherits(_InputElementEventsImpl, _ElementEventsImpl);
function _InputElementEventsImpl(_ptr) {
  _ElementEventsImpl.call(this, _ptr);
}
// ********** Code for _Int16ArrayImpl **************
var _Int16ArrayImpl = {};
$dynamic("is$List").Int16Array = function(){return true};
$dynamic("assert$List").Int16Array = function(){return this};
$dynamic("assert$List_Element").Int16Array = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
$dynamic("is$Collection").Int16Array = function(){return true};
$dynamic("assert$Collection").Int16Array = function(){return this};
$dynamic("assert$Collection_Firework").Int16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
$dynamic("assert$Collection_Spark").Int16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
$dynamic("assert$Collection_dart_core_Function").Int16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
$dynamic("assert$Collection_Future").Int16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
$dynamic("assert$Collection_Object").Int16Array = function(){return this};
$dynamic("assert$Collection_String").Int16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
$dynamic("assert$Collection_int").Int16Array = function(){return this};
$dynamic("assert$Collection_num").Int16Array = function(){return this};
$dynamic("assert$Collection_ClientRect").Int16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
$dynamic("assert$Collection_Element").Int16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
$dynamic("assert$Collection_Node").Int16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Node>"))};
$dynamic("assert$Collection_StyleSheet").Int16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
$dynamic("assert$Collection_TimeoutHandler").Int16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
$dynamic("assert$Collection_Touch").Int16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
$dynamic("assert$Collection__MeasurementRequest").Int16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
$dynamic("assert$Collection__NodeImpl").Int16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
$dynamic("assert$Iterable").Int16Array = function(){return this};
$dynamic("get$length").Int16Array = function() { return this.length; };
$dynamic("$index").Int16Array = function(index) {
  return this[index];
}
$dynamic("$setindex").Int16Array = function(index, value) {
  this[index] = value
}
$dynamic("iterator").Int16Array = function() {
  return new _FixedSizeListIterator_int(this);
}
$dynamic("add").Int16Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addLast").Int16Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addAll").Int16Array = function(collection) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("forEach").Int16Array = function(f) {
  return _Collections.forEach(this, f);
}
$dynamic("filter").Int16Array = function(f) {
  return _Collections.filter(this, [], f);
}
$dynamic("isEmpty").Int16Array = function() {
  return this.length == (0);
}
$dynamic("last").Int16Array = function() {
  return this.$index(this.length - (1));
}
$dynamic("removeRange").Int16Array = function(start, length) {
  $throw(new UnsupportedOperationException("Cannot removeRange on immutable List."));
}
$dynamic("getRange").Int16Array = function(start, length) {
  return _Lists.getRange(this, start, length, []);
}
$dynamic("add$1").Int16Array = function($0) {
  return this.add($assert_num($0));
};
$dynamic("addAll$1").Int16Array = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_int()));
};
$dynamic("addLast$1").Int16Array = function($0) {
  return this.addLast($assert_num($0));
};
$dynamic("forEach$1").Int16Array = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _Int32ArrayImpl **************
var _Int32ArrayImpl = {};
$dynamic("is$List").Int32Array = function(){return true};
$dynamic("assert$List").Int32Array = function(){return this};
$dynamic("assert$List_Element").Int32Array = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
$dynamic("is$Collection").Int32Array = function(){return true};
$dynamic("assert$Collection").Int32Array = function(){return this};
$dynamic("assert$Collection_Firework").Int32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
$dynamic("assert$Collection_Spark").Int32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
$dynamic("assert$Collection_dart_core_Function").Int32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
$dynamic("assert$Collection_Future").Int32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
$dynamic("assert$Collection_Object").Int32Array = function(){return this};
$dynamic("assert$Collection_String").Int32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
$dynamic("assert$Collection_int").Int32Array = function(){return this};
$dynamic("assert$Collection_num").Int32Array = function(){return this};
$dynamic("assert$Collection_ClientRect").Int32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
$dynamic("assert$Collection_Element").Int32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
$dynamic("assert$Collection_Node").Int32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Node>"))};
$dynamic("assert$Collection_StyleSheet").Int32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
$dynamic("assert$Collection_TimeoutHandler").Int32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
$dynamic("assert$Collection_Touch").Int32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
$dynamic("assert$Collection__MeasurementRequest").Int32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
$dynamic("assert$Collection__NodeImpl").Int32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
$dynamic("assert$Iterable").Int32Array = function(){return this};
$dynamic("get$length").Int32Array = function() { return this.length; };
$dynamic("$index").Int32Array = function(index) {
  return this[index];
}
$dynamic("$setindex").Int32Array = function(index, value) {
  this[index] = value
}
$dynamic("iterator").Int32Array = function() {
  return new _FixedSizeListIterator_int(this);
}
$dynamic("add").Int32Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addLast").Int32Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addAll").Int32Array = function(collection) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("forEach").Int32Array = function(f) {
  return _Collections.forEach(this, f);
}
$dynamic("filter").Int32Array = function(f) {
  return _Collections.filter(this, [], f);
}
$dynamic("isEmpty").Int32Array = function() {
  return this.length == (0);
}
$dynamic("last").Int32Array = function() {
  return this.$index(this.length - (1));
}
$dynamic("removeRange").Int32Array = function(start, length) {
  $throw(new UnsupportedOperationException("Cannot removeRange on immutable List."));
}
$dynamic("getRange").Int32Array = function(start, length) {
  return _Lists.getRange(this, start, length, []);
}
$dynamic("add$1").Int32Array = function($0) {
  return this.add($assert_num($0));
};
$dynamic("addAll$1").Int32Array = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_int()));
};
$dynamic("addLast$1").Int32Array = function($0) {
  return this.addLast($assert_num($0));
};
$dynamic("forEach$1").Int32Array = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _Int8ArrayImpl **************
var _Int8ArrayImpl = {};
$dynamic("is$List").Int8Array = function(){return true};
$dynamic("assert$List").Int8Array = function(){return this};
$dynamic("assert$List_Element").Int8Array = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
$dynamic("is$Collection").Int8Array = function(){return true};
$dynamic("assert$Collection").Int8Array = function(){return this};
$dynamic("assert$Collection_Firework").Int8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
$dynamic("assert$Collection_Spark").Int8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
$dynamic("assert$Collection_dart_core_Function").Int8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
$dynamic("assert$Collection_Future").Int8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
$dynamic("assert$Collection_Object").Int8Array = function(){return this};
$dynamic("assert$Collection_String").Int8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
$dynamic("assert$Collection_int").Int8Array = function(){return this};
$dynamic("assert$Collection_num").Int8Array = function(){return this};
$dynamic("assert$Collection_ClientRect").Int8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
$dynamic("assert$Collection_Element").Int8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
$dynamic("assert$Collection_Node").Int8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Node>"))};
$dynamic("assert$Collection_StyleSheet").Int8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
$dynamic("assert$Collection_TimeoutHandler").Int8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
$dynamic("assert$Collection_Touch").Int8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
$dynamic("assert$Collection__MeasurementRequest").Int8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
$dynamic("assert$Collection__NodeImpl").Int8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
$dynamic("assert$Iterable").Int8Array = function(){return this};
$dynamic("get$length").Int8Array = function() { return this.length; };
$dynamic("$index").Int8Array = function(index) {
  return this[index];
}
$dynamic("$setindex").Int8Array = function(index, value) {
  this[index] = value
}
$dynamic("iterator").Int8Array = function() {
  return new _FixedSizeListIterator_int(this);
}
$dynamic("add").Int8Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addLast").Int8Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addAll").Int8Array = function(collection) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("forEach").Int8Array = function(f) {
  return _Collections.forEach(this, f);
}
$dynamic("filter").Int8Array = function(f) {
  return _Collections.filter(this, [], f);
}
$dynamic("isEmpty").Int8Array = function() {
  return this.length == (0);
}
$dynamic("last").Int8Array = function() {
  return this.$index(this.length - (1));
}
$dynamic("removeRange").Int8Array = function(start, length) {
  $throw(new UnsupportedOperationException("Cannot removeRange on immutable List."));
}
$dynamic("getRange").Int8Array = function(start, length) {
  return _Lists.getRange(this, start, length, []);
}
$dynamic("add$1").Int8Array = function($0) {
  return this.add($assert_num($0));
};
$dynamic("addAll$1").Int8Array = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_int()));
};
$dynamic("addLast$1").Int8Array = function($0) {
  return this.addLast($assert_num($0));
};
$dynamic("forEach$1").Int8Array = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _JavaScriptAudioNodeImpl **************
// ********** Code for _JavaScriptCallFrameImpl **************
// ********** Code for _KeyboardEventImpl **************
// ********** Code for _KeygenElementImpl **************
$dynamic("is$html_Element").HTMLKeygenElement = function(){return true};
$dynamic("assert$html_Element").HTMLKeygenElement = function(){return this};
$dynamic("assert$html_Node").HTMLKeygenElement = function(){return this};
// ********** Code for _LIElementImpl **************
$dynamic("is$html_Element").HTMLLIElement = function(){return true};
$dynamic("assert$html_Element").HTMLLIElement = function(){return this};
$dynamic("assert$html_Node").HTMLLIElement = function(){return this};
// ********** Code for _LabelElementImpl **************
$dynamic("is$html_Element").HTMLLabelElement = function(){return true};
$dynamic("assert$html_Element").HTMLLabelElement = function(){return this};
$dynamic("assert$html_Node").HTMLLabelElement = function(){return this};
// ********** Code for _LegendElementImpl **************
$dynamic("is$html_Element").HTMLLegendElement = function(){return true};
$dynamic("assert$html_Element").HTMLLegendElement = function(){return this};
$dynamic("assert$html_Node").HTMLLegendElement = function(){return this};
// ********** Code for _LinkElementImpl **************
$dynamic("is$html_Element").HTMLLinkElement = function(){return true};
$dynamic("assert$html_Element").HTMLLinkElement = function(){return this};
$dynamic("assert$html_Node").HTMLLinkElement = function(){return this};
// ********** Code for _MediaStreamImpl **************
// ********** Code for _LocalMediaStreamImpl **************
// ********** Code for _LocationImpl **************
// ********** Code for _LowPass2FilterNodeImpl **************
// ********** Code for _MapElementImpl **************
$dynamic("is$html_Element").HTMLMapElement = function(){return true};
$dynamic("assert$html_Element").HTMLMapElement = function(){return this};
$dynamic("assert$html_Node").HTMLMapElement = function(){return this};
// ********** Code for _MarqueeElementImpl **************
$dynamic("is$html_Element").HTMLMarqueeElement = function(){return true};
$dynamic("assert$html_Element").HTMLMarqueeElement = function(){return this};
$dynamic("assert$html_Node").HTMLMarqueeElement = function(){return this};
// ********** Code for _MediaControllerImpl **************
// ********** Code for _MediaElementAudioSourceNodeImpl **************
// ********** Code for _MediaErrorImpl **************
// ********** Code for _MediaListImpl **************
$dynamic("is$List").MediaList = function(){return true};
$dynamic("assert$List").MediaList = function(){return this};
$dynamic("assert$List_Element").MediaList = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
$dynamic("is$Collection").MediaList = function(){return true};
$dynamic("assert$Collection").MediaList = function(){return this};
$dynamic("assert$Collection_Firework").MediaList = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
$dynamic("assert$Collection_Spark").MediaList = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
$dynamic("assert$Collection_dart_core_Function").MediaList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
$dynamic("assert$Collection_Future").MediaList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
$dynamic("assert$Collection_Object").MediaList = function(){return this};
$dynamic("assert$Collection_String").MediaList = function(){return this};
$dynamic("assert$Collection_int").MediaList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.int>"))};
$dynamic("assert$Collection_num").MediaList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.num>"))};
$dynamic("assert$Collection_ClientRect").MediaList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
$dynamic("assert$Collection_Element").MediaList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
$dynamic("assert$Collection_Node").MediaList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Node>"))};
$dynamic("assert$Collection_StyleSheet").MediaList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
$dynamic("assert$Collection_TimeoutHandler").MediaList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
$dynamic("assert$Collection_Touch").MediaList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
$dynamic("assert$Collection__MeasurementRequest").MediaList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
$dynamic("assert$Collection__NodeImpl").MediaList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
$dynamic("assert$Iterable").MediaList = function(){return this};
$dynamic("get$length").MediaList = function() { return this.length; };
$dynamic("$index").MediaList = function(index) {
  return this[index];
}
$dynamic("$setindex").MediaList = function(index, value) {
  $throw(new UnsupportedOperationException("Cannot assign element of immutable List."));
}
$dynamic("iterator").MediaList = function() {
  return new _FixedSizeListIterator_dart_core_String(this);
}
$dynamic("add").MediaList = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addLast").MediaList = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addAll").MediaList = function(collection) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("forEach").MediaList = function(f) {
  return _Collections.forEach(this, f);
}
$dynamic("filter").MediaList = function(f) {
  return _Collections.filter(this, [], f);
}
$dynamic("isEmpty").MediaList = function() {
  return this.length == (0);
}
$dynamic("last").MediaList = function() {
  return this.$index(this.length - (1));
}
$dynamic("removeRange").MediaList = function(start, length) {
  $throw(new UnsupportedOperationException("Cannot removeRange on immutable List."));
}
$dynamic("getRange").MediaList = function(start, length) {
  return _Lists.getRange(this, start, length, []);
}
$dynamic("add$1").MediaList = function($0) {
  return this.add($assert_String($0));
};
$dynamic("addAll$1").MediaList = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_String()));
};
$dynamic("addLast$1").MediaList = function($0) {
  return this.addLast($assert_String($0));
};
$dynamic("forEach$1").MediaList = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _MediaQueryListImpl **************
// ********** Code for _MediaQueryListListenerImpl **************
// ********** Code for _MediaStreamEventImpl **************
// ********** Code for _MediaStreamListImpl **************
// ********** Code for _MediaStreamTrackImpl **************
// ********** Code for _MediaStreamTrackListImpl **************
// ********** Code for _MemoryInfoImpl **************
// ********** Code for _MenuElementImpl **************
$dynamic("is$html_Element").HTMLMenuElement = function(){return true};
$dynamic("assert$html_Element").HTMLMenuElement = function(){return this};
$dynamic("assert$html_Node").HTMLMenuElement = function(){return this};
// ********** Code for _MessageChannelImpl **************
// ********** Code for _MessageEventImpl **************
// ********** Code for _MessagePortImpl **************
$dynamic("_addEventListener").MessagePort = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _MetaElementImpl **************
$dynamic("is$html_Element").HTMLMetaElement = function(){return true};
$dynamic("assert$html_Element").HTMLMetaElement = function(){return this};
$dynamic("assert$html_Node").HTMLMetaElement = function(){return this};
// ********** Code for _MetadataImpl **************
// ********** Code for _MeterElementImpl **************
$dynamic("is$html_Element").HTMLMeterElement = function(){return true};
$dynamic("assert$html_Element").HTMLMeterElement = function(){return this};
$dynamic("assert$html_Node").HTMLMeterElement = function(){return this};
// ********** Code for _ModElementImpl **************
$dynamic("is$html_Element").HTMLModElement = function(){return true};
$dynamic("assert$html_Element").HTMLModElement = function(){return this};
$dynamic("assert$html_Node").HTMLModElement = function(){return this};
// ********** Code for _MouseEventImpl **************
// ********** Code for _MutationEventImpl **************
// ********** Code for _NamedNodeMapImpl **************
$dynamic("is$List").NamedNodeMap = function(){return true};
$dynamic("assert$List").NamedNodeMap = function(){return this};
$dynamic("assert$List_Element").NamedNodeMap = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
$dynamic("is$Collection").NamedNodeMap = function(){return true};
$dynamic("assert$Collection").NamedNodeMap = function(){return this};
$dynamic("assert$Collection_Firework").NamedNodeMap = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
$dynamic("assert$Collection_Spark").NamedNodeMap = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
$dynamic("assert$Collection_dart_core_Function").NamedNodeMap = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
$dynamic("assert$Collection_Future").NamedNodeMap = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
$dynamic("assert$Collection_Object").NamedNodeMap = function(){return this};
$dynamic("assert$Collection_String").NamedNodeMap = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
$dynamic("assert$Collection_int").NamedNodeMap = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.int>"))};
$dynamic("assert$Collection_num").NamedNodeMap = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.num>"))};
$dynamic("assert$Collection_ClientRect").NamedNodeMap = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
$dynamic("assert$Collection_Element").NamedNodeMap = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
$dynamic("assert$Collection_Node").NamedNodeMap = function(){return this};
$dynamic("assert$Collection_StyleSheet").NamedNodeMap = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
$dynamic("assert$Collection_TimeoutHandler").NamedNodeMap = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
$dynamic("assert$Collection_Touch").NamedNodeMap = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
$dynamic("assert$Collection__MeasurementRequest").NamedNodeMap = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
$dynamic("assert$Collection__NodeImpl").NamedNodeMap = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
$dynamic("assert$Iterable").NamedNodeMap = function(){return this};
$dynamic("get$length").NamedNodeMap = function() { return this.length; };
$dynamic("$index").NamedNodeMap = function(index) {
  return this[index];
}
$dynamic("$setindex").NamedNodeMap = function(index, value) {
  $throw(new UnsupportedOperationException("Cannot assign element of immutable List."));
}
$dynamic("iterator").NamedNodeMap = function() {
  return new _FixedSizeListIterator_html_Node(this);
}
$dynamic("add").NamedNodeMap = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addLast").NamedNodeMap = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addAll").NamedNodeMap = function(collection) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("forEach").NamedNodeMap = function(f) {
  return _Collections.forEach(this, f);
}
$dynamic("filter").NamedNodeMap = function(f) {
  return _Collections.filter(this, [], f);
}
$dynamic("isEmpty").NamedNodeMap = function() {
  return this.length == (0);
}
$dynamic("last").NamedNodeMap = function() {
  return this.$index(this.length - (1));
}
$dynamic("removeRange").NamedNodeMap = function(start, length) {
  $throw(new UnsupportedOperationException("Cannot removeRange on immutable List."));
}
$dynamic("getRange").NamedNodeMap = function(start, length) {
  return _Lists.getRange(this, start, length, []);
}
$dynamic("add$1").NamedNodeMap = function($0) {
  return this.add(($0 == null ? null : $0.assert$html_Node()));
};
$dynamic("addAll$1").NamedNodeMap = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_Node()));
};
$dynamic("addLast$1").NamedNodeMap = function($0) {
  return this.addLast(($0 == null ? null : $0.assert$html_Node()));
};
$dynamic("forEach$1").NamedNodeMap = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _NavigatorImpl **************
// ********** Code for _NavigatorUserMediaErrorImpl **************
// ********** Code for _NodeFilterImpl **************
// ********** Code for _NodeIteratorImpl **************
// ********** Code for _ListWrapper_Node **************
$inherits(_ListWrapper_Node, _ListWrapper);
function _ListWrapper_Node(_list) {
  this._html_list = _list;
}
_ListWrapper_Node.prototype.is$List = function(){return true};
_ListWrapper_Node.prototype.assert$List = function(){return this};
_ListWrapper_Node.prototype.assert$List_Element = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
_ListWrapper_Node.prototype.is$Collection = function(){return true};
_ListWrapper_Node.prototype.assert$Collection = function(){return this};
_ListWrapper_Node.prototype.assert$Collection_Firework = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
_ListWrapper_Node.prototype.assert$Collection_Spark = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
_ListWrapper_Node.prototype.assert$Collection_dart_core_Function = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
_ListWrapper_Node.prototype.assert$Collection_Future = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
_ListWrapper_Node.prototype.assert$Collection_Object = function(){return this};
_ListWrapper_Node.prototype.assert$Collection_String = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
_ListWrapper_Node.prototype.assert$Collection_int = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.int>"))};
_ListWrapper_Node.prototype.assert$Collection_num = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.num>"))};
_ListWrapper_Node.prototype.assert$Collection_ClientRect = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
_ListWrapper_Node.prototype.assert$Collection_Element = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
_ListWrapper_Node.prototype.assert$Collection_Node = function(){return this};
_ListWrapper_Node.prototype.assert$Collection_StyleSheet = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
_ListWrapper_Node.prototype.assert$Collection_TimeoutHandler = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
_ListWrapper_Node.prototype.assert$Collection_Touch = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
_ListWrapper_Node.prototype.assert$Collection__MeasurementRequest = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
_ListWrapper_Node.prototype.assert$Collection__NodeImpl = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
_ListWrapper_Node.prototype.assert$Iterable = function(){return this};
_ListWrapper_Node.prototype.add$1 = function($0) {
  return this.add(($0 == null ? null : $0.assert$html_Node()));
};
_ListWrapper_Node.prototype.addAll$1 = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_Node()));
};
_ListWrapper_Node.prototype.clear$0 = _ListWrapper_Node.prototype.clear;
_ListWrapper_Node.prototype.forEach$1 = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _NodeListWrapper **************
$inherits(_NodeListWrapper, _ListWrapper_Node);
function _NodeListWrapper(list) {
  _ListWrapper_Node.call(this, list);
}
_NodeListWrapper.prototype.is$List = function(){return true};
_NodeListWrapper.prototype.assert$List = function(){return this};
_NodeListWrapper.prototype.assert$List_Element = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
_NodeListWrapper.prototype.is$Collection = function(){return true};
_NodeListWrapper.prototype.assert$Collection = function(){return this};
_NodeListWrapper.prototype.assert$Collection_Firework = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
_NodeListWrapper.prototype.assert$Collection_Spark = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
_NodeListWrapper.prototype.assert$Collection_dart_core_Function = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
_NodeListWrapper.prototype.assert$Collection_Future = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
_NodeListWrapper.prototype.assert$Collection_Object = function(){return this};
_NodeListWrapper.prototype.assert$Collection_String = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
_NodeListWrapper.prototype.assert$Collection_int = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.int>"))};
_NodeListWrapper.prototype.assert$Collection_num = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.num>"))};
_NodeListWrapper.prototype.assert$Collection_ClientRect = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
_NodeListWrapper.prototype.assert$Collection_Element = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
_NodeListWrapper.prototype.assert$Collection_Node = function(){return this};
_NodeListWrapper.prototype.assert$Collection_StyleSheet = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
_NodeListWrapper.prototype.assert$Collection_TimeoutHandler = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
_NodeListWrapper.prototype.assert$Collection_Touch = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
_NodeListWrapper.prototype.assert$Collection__MeasurementRequest = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
_NodeListWrapper.prototype.assert$Collection__NodeImpl = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
_NodeListWrapper.prototype.assert$Iterable = function(){return this};
_NodeListWrapper.prototype.filter = function(f) {
  var $0;
  return new _NodeListWrapper((($0 = this._html_list.filter(f)) == null ? null : $0.assert$List()));
}
_NodeListWrapper.prototype.getRange = function(start, length) {
  var $0;
  return new _NodeListWrapper((($0 = this._html_list.getRange(start, length)) == null ? null : $0.assert$List()));
}
// ********** Code for _NodeListImpl **************
$dynamic("assert$_NodeListImpl").NodeList = function(){return this};
$dynamic("is$List").NodeList = function(){return true};
$dynamic("assert$List").NodeList = function(){return this};
$dynamic("assert$List_Element").NodeList = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
$dynamic("is$Collection").NodeList = function(){return true};
$dynamic("assert$Collection").NodeList = function(){return this};
$dynamic("assert$Collection_Firework").NodeList = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
$dynamic("assert$Collection_Spark").NodeList = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
$dynamic("assert$Collection_dart_core_Function").NodeList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
$dynamic("assert$Collection_Future").NodeList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
$dynamic("assert$Collection_Object").NodeList = function(){return this};
$dynamic("assert$Collection_String").NodeList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
$dynamic("assert$Collection_int").NodeList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.int>"))};
$dynamic("assert$Collection_num").NodeList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.num>"))};
$dynamic("assert$Collection_ClientRect").NodeList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
$dynamic("assert$Collection_Element").NodeList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
$dynamic("assert$Collection_Node").NodeList = function(){return this};
$dynamic("assert$Collection_StyleSheet").NodeList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
$dynamic("assert$Collection_TimeoutHandler").NodeList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
$dynamic("assert$Collection_Touch").NodeList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
$dynamic("assert$Collection__MeasurementRequest").NodeList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
$dynamic("assert$Collection__NodeImpl").NodeList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
$dynamic("assert$Iterable").NodeList = function(){return this};
$dynamic("set$_parent").NodeList = function(value) { return this._parent = value; };
$dynamic("iterator").NodeList = function() {
  return new _FixedSizeListIterator_html_Node(this);
}
$dynamic("add").NodeList = function(value) {
  this._parent._appendChild(value);
}
$dynamic("addLast").NodeList = function(value) {
  this._parent._appendChild(value);
}
$dynamic("addAll").NodeList = function(collection) {
  for (var $$i = collection.iterator(); $$i.hasNext(); ) {
    var node = $$i.next();
    this._parent._appendChild(node);
  }
}
$dynamic("removeLast").NodeList = function() {
  var last = this.last();
  if ($ne$(last)) {
    this._parent._removeChild((last == null ? null : last.assert$_NodeImpl()));
  }
  return (last == null ? null : last.assert$_NodeImpl());
}
$dynamic("clear").NodeList = function() {
  this._parent.set$text("");
}
$dynamic("$setindex").NodeList = function(index, value) {
  this._parent._replaceChild(value, this.$index(index));
}
$dynamic("forEach").NodeList = function(f) {
  return _Collections.forEach(this, f);
}
$dynamic("filter").NodeList = function(f) {
  return new _NodeListWrapper(_Collections.filter(this, [], f));
}
$dynamic("isEmpty").NodeList = function() {
  return this.length == (0);
}
$dynamic("last").NodeList = function() {
  return this.$index(this.length - (1));
}
$dynamic("removeRange").NodeList = function(start, length) {
  $throw(new UnsupportedOperationException("Cannot removeRange on immutable List."));
}
$dynamic("getRange").NodeList = function(start, length) {
  return new _NodeListWrapper(_Lists.getRange(this, start, length, []));
}
$dynamic("get$length").NodeList = function() { return this.length; };
$dynamic("$index").NodeList = function(index) {
  return this[index];
}
$dynamic("add$1").NodeList = function($0) {
  return this.add(($0 == null ? null : $0.assert$_NodeImpl()));
};
$dynamic("addAll$1").NodeList = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection__NodeImpl()));
};
$dynamic("addLast$1").NodeList = function($0) {
  return this.addLast(($0 == null ? null : $0.assert$_NodeImpl()));
};
$dynamic("clear$0").NodeList = function() {
  return this.clear();
};
$dynamic("forEach$1").NodeList = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _NodeSelectorImpl **************
// ********** Code for _NotationImpl **************
$dynamic("assert$html_Node").Notation = function(){return this};
// ********** Code for _NotificationImpl **************
// ********** Code for _NotificationCenterImpl **************
// ********** Code for _OESStandardDerivativesImpl **************
// ********** Code for _OESTextureFloatImpl **************
// ********** Code for _OESVertexArrayObjectImpl **************
// ********** Code for _OListElementImpl **************
$dynamic("is$html_Element").HTMLOListElement = function(){return true};
$dynamic("assert$html_Element").HTMLOListElement = function(){return this};
$dynamic("assert$html_Node").HTMLOListElement = function(){return this};
// ********** Code for _ObjectElementImpl **************
$dynamic("is$html_Element").HTMLObjectElement = function(){return true};
$dynamic("assert$html_Element").HTMLObjectElement = function(){return this};
$dynamic("assert$html_Node").HTMLObjectElement = function(){return this};
// ********** Code for _OfflineAudioCompletionEventImpl **************
// ********** Code for _OperationNotAllowedExceptionImpl **************
// ********** Code for _OptGroupElementImpl **************
$dynamic("is$html_Element").HTMLOptGroupElement = function(){return true};
$dynamic("assert$html_Element").HTMLOptGroupElement = function(){return this};
$dynamic("assert$html_Node").HTMLOptGroupElement = function(){return this};
// ********** Code for _OptionElementImpl **************
$dynamic("is$html_Element").HTMLOptionElement = function(){return true};
$dynamic("assert$html_Element").HTMLOptionElement = function(){return this};
$dynamic("assert$html_Node").HTMLOptionElement = function(){return this};
// ********** Code for _OutputElementImpl **************
$dynamic("is$html_Element").HTMLOutputElement = function(){return true};
$dynamic("assert$html_Element").HTMLOutputElement = function(){return this};
$dynamic("assert$html_Node").HTMLOutputElement = function(){return this};
// ********** Code for _OverflowEventImpl **************
// ********** Code for _PageTransitionEventImpl **************
// ********** Code for _ParagraphElementImpl **************
$dynamic("is$html_Element").HTMLParagraphElement = function(){return true};
$dynamic("assert$html_Element").HTMLParagraphElement = function(){return this};
$dynamic("assert$html_Node").HTMLParagraphElement = function(){return this};
// ********** Code for _ParamElementImpl **************
$dynamic("is$html_Element").HTMLParamElement = function(){return true};
$dynamic("assert$html_Element").HTMLParamElement = function(){return this};
$dynamic("assert$html_Node").HTMLParamElement = function(){return this};
// ********** Code for _PerformanceImpl **************
// ********** Code for _PerformanceNavigationImpl **************
// ********** Code for _PerformanceTimingImpl **************
// ********** Code for _PointImpl **************
// ********** Code for _PopStateEventImpl **************
// ********** Code for _PositionErrorImpl **************
// ********** Code for _PreElementImpl **************
$dynamic("is$html_Element").HTMLPreElement = function(){return true};
$dynamic("assert$html_Element").HTMLPreElement = function(){return this};
$dynamic("assert$html_Node").HTMLPreElement = function(){return this};
// ********** Code for _ProcessingInstructionImpl **************
$dynamic("assert$html_Node").ProcessingInstruction = function(){return this};
// ********** Code for _ProgressElementImpl **************
$dynamic("is$html_Element").HTMLProgressElement = function(){return true};
$dynamic("assert$html_Element").HTMLProgressElement = function(){return this};
$dynamic("assert$html_Node").HTMLProgressElement = function(){return this};
// ********** Code for _ProgressEventImpl **************
// ********** Code for _QuoteElementImpl **************
$dynamic("is$html_Element").HTMLQuoteElement = function(){return true};
$dynamic("assert$html_Element").HTMLQuoteElement = function(){return this};
$dynamic("assert$html_Node").HTMLQuoteElement = function(){return this};
// ********** Code for _RGBColorImpl **************
// ********** Code for _RangeImpl **************
// ********** Code for _RangeExceptionImpl **************
// ********** Code for _RealtimeAnalyserNodeImpl **************
// ********** Code for _RectImpl **************
$dynamic("get$left").Rect = function() { return this.left; };
$dynamic("get$top").Rect = function() { return this.top; };
// ********** Code for _SQLErrorImpl **************
// ********** Code for _SQLExceptionImpl **************
// ********** Code for _SQLResultSetImpl **************
// ********** Code for _SQLResultSetRowListImpl **************
// ********** Code for _SQLTransactionImpl **************
// ********** Code for _SQLTransactionSyncImpl **************
// ********** Code for _SVGElementImpl **************
$dynamic("is$html_Element").SVGElement = function(){return true};
$dynamic("assert$html_Element").SVGElement = function(){return this};
$dynamic("assert$html_Node").SVGElement = function(){return this};
$dynamic("get$elements").SVGElement = function() {
  return new FilteredElementList(this);
}
$dynamic("set$elements").SVGElement = function(value) {
  var elements = this.get$elements();
  elements.clear$0();
  elements.addAll$1(value);
}
$dynamic("set$innerHTML").SVGElement = function(svg) {
  var container = _ElementFactoryProvider.Element$tag$factory("div");
  container.set$innerHTML(("<svg version=\"1.1\">" + svg + "</svg>"));
  this.set$elements(container.get$elements().get$first().get$elements());
}
// ********** Code for _SVGAElementImpl **************
$dynamic("is$html_Element").SVGAElement = function(){return true};
$dynamic("assert$html_Element").SVGAElement = function(){return this};
$dynamic("assert$html_Node").SVGAElement = function(){return this};
// ********** Code for _SVGAltGlyphDefElementImpl **************
$dynamic("is$html_Element").SVGAltGlyphDefElement = function(){return true};
$dynamic("assert$html_Element").SVGAltGlyphDefElement = function(){return this};
$dynamic("assert$html_Node").SVGAltGlyphDefElement = function(){return this};
// ********** Code for _SVGTextContentElementImpl **************
$dynamic("is$html_Element").SVGTextContentElement = function(){return true};
$dynamic("assert$html_Element").SVGTextContentElement = function(){return this};
$dynamic("assert$html_Node").SVGTextContentElement = function(){return this};
// ********** Code for _SVGTextPositioningElementImpl **************
$dynamic("is$html_Element").SVGTextPositioningElement = function(){return true};
$dynamic("assert$html_Element").SVGTextPositioningElement = function(){return this};
$dynamic("assert$html_Node").SVGTextPositioningElement = function(){return this};
// ********** Code for _SVGAltGlyphElementImpl **************
$dynamic("is$html_Element").SVGAltGlyphElement = function(){return true};
$dynamic("assert$html_Element").SVGAltGlyphElement = function(){return this};
$dynamic("assert$html_Node").SVGAltGlyphElement = function(){return this};
// ********** Code for _SVGAltGlyphItemElementImpl **************
$dynamic("is$html_Element").SVGAltGlyphItemElement = function(){return true};
$dynamic("assert$html_Element").SVGAltGlyphItemElement = function(){return this};
$dynamic("assert$html_Node").SVGAltGlyphItemElement = function(){return this};
// ********** Code for _SVGAngleImpl **************
// ********** Code for _SVGAnimationElementImpl **************
$dynamic("is$html_Element").SVGAnimationElement = function(){return true};
$dynamic("assert$html_Element").SVGAnimationElement = function(){return this};
$dynamic("assert$html_Node").SVGAnimationElement = function(){return this};
// ********** Code for _SVGAnimateColorElementImpl **************
$dynamic("is$html_Element").SVGAnimateColorElement = function(){return true};
$dynamic("assert$html_Element").SVGAnimateColorElement = function(){return this};
$dynamic("assert$html_Node").SVGAnimateColorElement = function(){return this};
// ********** Code for _SVGAnimateElementImpl **************
$dynamic("is$html_Element").SVGAnimateElement = function(){return true};
$dynamic("assert$html_Element").SVGAnimateElement = function(){return this};
$dynamic("assert$html_Node").SVGAnimateElement = function(){return this};
// ********** Code for _SVGAnimateMotionElementImpl **************
$dynamic("is$html_Element").SVGAnimateMotionElement = function(){return true};
$dynamic("assert$html_Element").SVGAnimateMotionElement = function(){return this};
$dynamic("assert$html_Node").SVGAnimateMotionElement = function(){return this};
// ********** Code for _SVGAnimateTransformElementImpl **************
$dynamic("is$html_Element").SVGAnimateTransformElement = function(){return true};
$dynamic("assert$html_Element").SVGAnimateTransformElement = function(){return this};
$dynamic("assert$html_Node").SVGAnimateTransformElement = function(){return this};
// ********** Code for _SVGAnimatedAngleImpl **************
// ********** Code for _SVGAnimatedBooleanImpl **************
// ********** Code for _SVGAnimatedEnumerationImpl **************
// ********** Code for _SVGAnimatedIntegerImpl **************
// ********** Code for _SVGAnimatedLengthImpl **************
// ********** Code for _SVGAnimatedLengthListImpl **************
// ********** Code for _SVGAnimatedNumberImpl **************
// ********** Code for _SVGAnimatedNumberListImpl **************
// ********** Code for _SVGAnimatedPreserveAspectRatioImpl **************
// ********** Code for _SVGAnimatedRectImpl **************
// ********** Code for _SVGAnimatedStringImpl **************
// ********** Code for _SVGAnimatedTransformListImpl **************
// ********** Code for _SVGCircleElementImpl **************
$dynamic("is$html_Element").SVGCircleElement = function(){return true};
$dynamic("assert$html_Element").SVGCircleElement = function(){return this};
$dynamic("assert$html_Node").SVGCircleElement = function(){return this};
// ********** Code for _SVGClipPathElementImpl **************
$dynamic("is$html_Element").SVGClipPathElement = function(){return true};
$dynamic("assert$html_Element").SVGClipPathElement = function(){return this};
$dynamic("assert$html_Node").SVGClipPathElement = function(){return this};
// ********** Code for _SVGColorImpl **************
// ********** Code for _SVGComponentTransferFunctionElementImpl **************
$dynamic("is$html_Element").SVGComponentTransferFunctionElement = function(){return true};
$dynamic("assert$html_Element").SVGComponentTransferFunctionElement = function(){return this};
$dynamic("assert$html_Node").SVGComponentTransferFunctionElement = function(){return this};
// ********** Code for _SVGCursorElementImpl **************
$dynamic("is$html_Element").SVGCursorElement = function(){return true};
$dynamic("assert$html_Element").SVGCursorElement = function(){return this};
$dynamic("assert$html_Node").SVGCursorElement = function(){return this};
// ********** Code for _SVGDefsElementImpl **************
$dynamic("is$html_Element").SVGDefsElement = function(){return true};
$dynamic("assert$html_Element").SVGDefsElement = function(){return this};
$dynamic("assert$html_Node").SVGDefsElement = function(){return this};
// ********** Code for _SVGDescElementImpl **************
$dynamic("is$html_Element").SVGDescElement = function(){return true};
$dynamic("assert$html_Element").SVGDescElement = function(){return this};
$dynamic("assert$html_Node").SVGDescElement = function(){return this};
// ********** Code for _SVGDocumentImpl **************
$dynamic("is$html_Element").SVGDocument = function(){return true};
$dynamic("assert$html_Element").SVGDocument = function(){return this};
$dynamic("assert$html_Node").SVGDocument = function(){return this};
// ********** Code for _SVGElementInstanceImpl **************
$dynamic("_addEventListener").SVGElementInstance = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _SVGElementInstanceListImpl **************
// ********** Code for _SVGEllipseElementImpl **************
$dynamic("is$html_Element").SVGEllipseElement = function(){return true};
$dynamic("assert$html_Element").SVGEllipseElement = function(){return this};
$dynamic("assert$html_Node").SVGEllipseElement = function(){return this};
// ********** Code for _SVGExceptionImpl **************
// ********** Code for _SVGExternalResourcesRequiredImpl **************
// ********** Code for _SVGFEBlendElementImpl **************
$dynamic("is$html_Element").SVGFEBlendElement = function(){return true};
$dynamic("assert$html_Element").SVGFEBlendElement = function(){return this};
$dynamic("assert$html_Node").SVGFEBlendElement = function(){return this};
// ********** Code for _SVGFEColorMatrixElementImpl **************
$dynamic("is$html_Element").SVGFEColorMatrixElement = function(){return true};
$dynamic("assert$html_Element").SVGFEColorMatrixElement = function(){return this};
$dynamic("assert$html_Node").SVGFEColorMatrixElement = function(){return this};
// ********** Code for _SVGFEComponentTransferElementImpl **************
$dynamic("is$html_Element").SVGFEComponentTransferElement = function(){return true};
$dynamic("assert$html_Element").SVGFEComponentTransferElement = function(){return this};
$dynamic("assert$html_Node").SVGFEComponentTransferElement = function(){return this};
// ********** Code for _SVGFECompositeElementImpl **************
$dynamic("is$html_Element").SVGFECompositeElement = function(){return true};
$dynamic("assert$html_Element").SVGFECompositeElement = function(){return this};
$dynamic("assert$html_Node").SVGFECompositeElement = function(){return this};
// ********** Code for _SVGFEConvolveMatrixElementImpl **************
$dynamic("is$html_Element").SVGFEConvolveMatrixElement = function(){return true};
$dynamic("assert$html_Element").SVGFEConvolveMatrixElement = function(){return this};
$dynamic("assert$html_Node").SVGFEConvolveMatrixElement = function(){return this};
// ********** Code for _SVGFEDiffuseLightingElementImpl **************
$dynamic("is$html_Element").SVGFEDiffuseLightingElement = function(){return true};
$dynamic("assert$html_Element").SVGFEDiffuseLightingElement = function(){return this};
$dynamic("assert$html_Node").SVGFEDiffuseLightingElement = function(){return this};
// ********** Code for _SVGFEDisplacementMapElementImpl **************
$dynamic("is$html_Element").SVGFEDisplacementMapElement = function(){return true};
$dynamic("assert$html_Element").SVGFEDisplacementMapElement = function(){return this};
$dynamic("assert$html_Node").SVGFEDisplacementMapElement = function(){return this};
// ********** Code for _SVGFEDistantLightElementImpl **************
$dynamic("is$html_Element").SVGFEDistantLightElement = function(){return true};
$dynamic("assert$html_Element").SVGFEDistantLightElement = function(){return this};
$dynamic("assert$html_Node").SVGFEDistantLightElement = function(){return this};
// ********** Code for _SVGFEDropShadowElementImpl **************
$dynamic("is$html_Element").SVGFEDropShadowElement = function(){return true};
$dynamic("assert$html_Element").SVGFEDropShadowElement = function(){return this};
$dynamic("assert$html_Node").SVGFEDropShadowElement = function(){return this};
// ********** Code for _SVGFEFloodElementImpl **************
$dynamic("is$html_Element").SVGFEFloodElement = function(){return true};
$dynamic("assert$html_Element").SVGFEFloodElement = function(){return this};
$dynamic("assert$html_Node").SVGFEFloodElement = function(){return this};
// ********** Code for _SVGFEFuncAElementImpl **************
$dynamic("is$html_Element").SVGFEFuncAElement = function(){return true};
$dynamic("assert$html_Element").SVGFEFuncAElement = function(){return this};
$dynamic("assert$html_Node").SVGFEFuncAElement = function(){return this};
// ********** Code for _SVGFEFuncBElementImpl **************
$dynamic("is$html_Element").SVGFEFuncBElement = function(){return true};
$dynamic("assert$html_Element").SVGFEFuncBElement = function(){return this};
$dynamic("assert$html_Node").SVGFEFuncBElement = function(){return this};
// ********** Code for _SVGFEFuncGElementImpl **************
$dynamic("is$html_Element").SVGFEFuncGElement = function(){return true};
$dynamic("assert$html_Element").SVGFEFuncGElement = function(){return this};
$dynamic("assert$html_Node").SVGFEFuncGElement = function(){return this};
// ********** Code for _SVGFEFuncRElementImpl **************
$dynamic("is$html_Element").SVGFEFuncRElement = function(){return true};
$dynamic("assert$html_Element").SVGFEFuncRElement = function(){return this};
$dynamic("assert$html_Node").SVGFEFuncRElement = function(){return this};
// ********** Code for _SVGFEGaussianBlurElementImpl **************
$dynamic("is$html_Element").SVGFEGaussianBlurElement = function(){return true};
$dynamic("assert$html_Element").SVGFEGaussianBlurElement = function(){return this};
$dynamic("assert$html_Node").SVGFEGaussianBlurElement = function(){return this};
// ********** Code for _SVGFEImageElementImpl **************
$dynamic("is$html_Element").SVGFEImageElement = function(){return true};
$dynamic("assert$html_Element").SVGFEImageElement = function(){return this};
$dynamic("assert$html_Node").SVGFEImageElement = function(){return this};
// ********** Code for _SVGFEMergeElementImpl **************
$dynamic("is$html_Element").SVGFEMergeElement = function(){return true};
$dynamic("assert$html_Element").SVGFEMergeElement = function(){return this};
$dynamic("assert$html_Node").SVGFEMergeElement = function(){return this};
// ********** Code for _SVGFEMergeNodeElementImpl **************
$dynamic("is$html_Element").SVGFEMergeNodeElement = function(){return true};
$dynamic("assert$html_Element").SVGFEMergeNodeElement = function(){return this};
$dynamic("assert$html_Node").SVGFEMergeNodeElement = function(){return this};
// ********** Code for _SVGFEMorphologyElementImpl **************
$dynamic("is$html_Element").SVGFEMorphologyElement = function(){return true};
$dynamic("assert$html_Element").SVGFEMorphologyElement = function(){return this};
$dynamic("assert$html_Node").SVGFEMorphologyElement = function(){return this};
// ********** Code for _SVGFEOffsetElementImpl **************
$dynamic("is$html_Element").SVGFEOffsetElement = function(){return true};
$dynamic("assert$html_Element").SVGFEOffsetElement = function(){return this};
$dynamic("assert$html_Node").SVGFEOffsetElement = function(){return this};
// ********** Code for _SVGFEPointLightElementImpl **************
$dynamic("is$html_Element").SVGFEPointLightElement = function(){return true};
$dynamic("assert$html_Element").SVGFEPointLightElement = function(){return this};
$dynamic("assert$html_Node").SVGFEPointLightElement = function(){return this};
// ********** Code for _SVGFESpecularLightingElementImpl **************
$dynamic("is$html_Element").SVGFESpecularLightingElement = function(){return true};
$dynamic("assert$html_Element").SVGFESpecularLightingElement = function(){return this};
$dynamic("assert$html_Node").SVGFESpecularLightingElement = function(){return this};
// ********** Code for _SVGFESpotLightElementImpl **************
$dynamic("is$html_Element").SVGFESpotLightElement = function(){return true};
$dynamic("assert$html_Element").SVGFESpotLightElement = function(){return this};
$dynamic("assert$html_Node").SVGFESpotLightElement = function(){return this};
// ********** Code for _SVGFETileElementImpl **************
$dynamic("is$html_Element").SVGFETileElement = function(){return true};
$dynamic("assert$html_Element").SVGFETileElement = function(){return this};
$dynamic("assert$html_Node").SVGFETileElement = function(){return this};
// ********** Code for _SVGFETurbulenceElementImpl **************
$dynamic("is$html_Element").SVGFETurbulenceElement = function(){return true};
$dynamic("assert$html_Element").SVGFETurbulenceElement = function(){return this};
$dynamic("assert$html_Node").SVGFETurbulenceElement = function(){return this};
// ********** Code for _SVGFilterElementImpl **************
$dynamic("is$html_Element").SVGFilterElement = function(){return true};
$dynamic("assert$html_Element").SVGFilterElement = function(){return this};
$dynamic("assert$html_Node").SVGFilterElement = function(){return this};
// ********** Code for _SVGStylableImpl **************
// ********** Code for _SVGFilterPrimitiveStandardAttributesImpl **************
// ********** Code for _SVGFitToViewBoxImpl **************
// ********** Code for _SVGFontElementImpl **************
$dynamic("is$html_Element").SVGFontElement = function(){return true};
$dynamic("assert$html_Element").SVGFontElement = function(){return this};
$dynamic("assert$html_Node").SVGFontElement = function(){return this};
// ********** Code for _SVGFontFaceElementImpl **************
$dynamic("is$html_Element").SVGFontFaceElement = function(){return true};
$dynamic("assert$html_Element").SVGFontFaceElement = function(){return this};
$dynamic("assert$html_Node").SVGFontFaceElement = function(){return this};
// ********** Code for _SVGFontFaceFormatElementImpl **************
$dynamic("is$html_Element").SVGFontFaceFormatElement = function(){return true};
$dynamic("assert$html_Element").SVGFontFaceFormatElement = function(){return this};
$dynamic("assert$html_Node").SVGFontFaceFormatElement = function(){return this};
// ********** Code for _SVGFontFaceNameElementImpl **************
$dynamic("is$html_Element").SVGFontFaceNameElement = function(){return true};
$dynamic("assert$html_Element").SVGFontFaceNameElement = function(){return this};
$dynamic("assert$html_Node").SVGFontFaceNameElement = function(){return this};
// ********** Code for _SVGFontFaceSrcElementImpl **************
$dynamic("is$html_Element").SVGFontFaceSrcElement = function(){return true};
$dynamic("assert$html_Element").SVGFontFaceSrcElement = function(){return this};
$dynamic("assert$html_Node").SVGFontFaceSrcElement = function(){return this};
// ********** Code for _SVGFontFaceUriElementImpl **************
$dynamic("is$html_Element").SVGFontFaceUriElement = function(){return true};
$dynamic("assert$html_Element").SVGFontFaceUriElement = function(){return this};
$dynamic("assert$html_Node").SVGFontFaceUriElement = function(){return this};
// ********** Code for _SVGForeignObjectElementImpl **************
$dynamic("is$html_Element").SVGForeignObjectElement = function(){return true};
$dynamic("assert$html_Element").SVGForeignObjectElement = function(){return this};
$dynamic("assert$html_Node").SVGForeignObjectElement = function(){return this};
// ********** Code for _SVGGElementImpl **************
$dynamic("is$html_Element").SVGGElement = function(){return true};
$dynamic("assert$html_Element").SVGGElement = function(){return this};
$dynamic("assert$html_Node").SVGGElement = function(){return this};
// ********** Code for _SVGGlyphElementImpl **************
$dynamic("is$html_Element").SVGGlyphElement = function(){return true};
$dynamic("assert$html_Element").SVGGlyphElement = function(){return this};
$dynamic("assert$html_Node").SVGGlyphElement = function(){return this};
// ********** Code for _SVGGlyphRefElementImpl **************
$dynamic("is$html_Element").SVGGlyphRefElement = function(){return true};
$dynamic("assert$html_Element").SVGGlyphRefElement = function(){return this};
$dynamic("assert$html_Node").SVGGlyphRefElement = function(){return this};
// ********** Code for _SVGGradientElementImpl **************
$dynamic("is$html_Element").SVGGradientElement = function(){return true};
$dynamic("assert$html_Element").SVGGradientElement = function(){return this};
$dynamic("assert$html_Node").SVGGradientElement = function(){return this};
// ********** Code for _SVGHKernElementImpl **************
$dynamic("is$html_Element").SVGHKernElement = function(){return true};
$dynamic("assert$html_Element").SVGHKernElement = function(){return this};
$dynamic("assert$html_Node").SVGHKernElement = function(){return this};
// ********** Code for _SVGImageElementImpl **************
$dynamic("is$html_Element").SVGImageElement = function(){return true};
$dynamic("assert$html_Element").SVGImageElement = function(){return this};
$dynamic("assert$html_Node").SVGImageElement = function(){return this};
// ********** Code for _SVGLangSpaceImpl **************
// ********** Code for _SVGLengthImpl **************
// ********** Code for _SVGLengthListImpl **************
$dynamic("clear$0").SVGLengthList = function() {
  return this.clear();
};
// ********** Code for _SVGLineElementImpl **************
$dynamic("is$html_Element").SVGLineElement = function(){return true};
$dynamic("assert$html_Element").SVGLineElement = function(){return this};
$dynamic("assert$html_Node").SVGLineElement = function(){return this};
// ********** Code for _SVGLinearGradientElementImpl **************
$dynamic("is$html_Element").SVGLinearGradientElement = function(){return true};
$dynamic("assert$html_Element").SVGLinearGradientElement = function(){return this};
$dynamic("assert$html_Node").SVGLinearGradientElement = function(){return this};
// ********** Code for _SVGLocatableImpl **************
// ********** Code for _SVGMPathElementImpl **************
$dynamic("is$html_Element").SVGMPathElement = function(){return true};
$dynamic("assert$html_Element").SVGMPathElement = function(){return this};
$dynamic("assert$html_Node").SVGMPathElement = function(){return this};
// ********** Code for _SVGMarkerElementImpl **************
$dynamic("is$html_Element").SVGMarkerElement = function(){return true};
$dynamic("assert$html_Element").SVGMarkerElement = function(){return this};
$dynamic("assert$html_Node").SVGMarkerElement = function(){return this};
// ********** Code for _SVGMaskElementImpl **************
$dynamic("is$html_Element").SVGMaskElement = function(){return true};
$dynamic("assert$html_Element").SVGMaskElement = function(){return this};
$dynamic("assert$html_Node").SVGMaskElement = function(){return this};
// ********** Code for _SVGMatrixImpl **************
// ********** Code for _SVGMetadataElementImpl **************
$dynamic("is$html_Element").SVGMetadataElement = function(){return true};
$dynamic("assert$html_Element").SVGMetadataElement = function(){return this};
$dynamic("assert$html_Node").SVGMetadataElement = function(){return this};
// ********** Code for _SVGMissingGlyphElementImpl **************
$dynamic("is$html_Element").SVGMissingGlyphElement = function(){return true};
$dynamic("assert$html_Element").SVGMissingGlyphElement = function(){return this};
$dynamic("assert$html_Node").SVGMissingGlyphElement = function(){return this};
// ********** Code for _SVGNumberImpl **************
// ********** Code for _SVGNumberListImpl **************
$dynamic("clear$0").SVGNumberList = function() {
  return this.clear();
};
// ********** Code for _SVGPaintImpl **************
// ********** Code for _SVGPathElementImpl **************
$dynamic("is$html_Element").SVGPathElement = function(){return true};
$dynamic("assert$html_Element").SVGPathElement = function(){return this};
$dynamic("assert$html_Node").SVGPathElement = function(){return this};
// ********** Code for _SVGPathSegImpl **************
// ********** Code for _SVGPathSegArcAbsImpl **************
// ********** Code for _SVGPathSegArcRelImpl **************
// ********** Code for _SVGPathSegClosePathImpl **************
// ********** Code for _SVGPathSegCurvetoCubicAbsImpl **************
// ********** Code for _SVGPathSegCurvetoCubicRelImpl **************
// ********** Code for _SVGPathSegCurvetoCubicSmoothAbsImpl **************
// ********** Code for _SVGPathSegCurvetoCubicSmoothRelImpl **************
// ********** Code for _SVGPathSegCurvetoQuadraticAbsImpl **************
// ********** Code for _SVGPathSegCurvetoQuadraticRelImpl **************
// ********** Code for _SVGPathSegCurvetoQuadraticSmoothAbsImpl **************
// ********** Code for _SVGPathSegCurvetoQuadraticSmoothRelImpl **************
// ********** Code for _SVGPathSegLinetoAbsImpl **************
// ********** Code for _SVGPathSegLinetoHorizontalAbsImpl **************
// ********** Code for _SVGPathSegLinetoHorizontalRelImpl **************
// ********** Code for _SVGPathSegLinetoRelImpl **************
// ********** Code for _SVGPathSegLinetoVerticalAbsImpl **************
// ********** Code for _SVGPathSegLinetoVerticalRelImpl **************
// ********** Code for _SVGPathSegListImpl **************
$dynamic("clear$0").SVGPathSegList = function() {
  return this.clear();
};
// ********** Code for _SVGPathSegMovetoAbsImpl **************
// ********** Code for _SVGPathSegMovetoRelImpl **************
// ********** Code for _SVGPatternElementImpl **************
$dynamic("is$html_Element").SVGPatternElement = function(){return true};
$dynamic("assert$html_Element").SVGPatternElement = function(){return this};
$dynamic("assert$html_Node").SVGPatternElement = function(){return this};
// ********** Code for _SVGPointImpl **************
// ********** Code for _SVGPointListImpl **************
$dynamic("clear$0").SVGPointList = function() {
  return this.clear();
};
// ********** Code for _SVGPolygonElementImpl **************
$dynamic("is$html_Element").SVGPolygonElement = function(){return true};
$dynamic("assert$html_Element").SVGPolygonElement = function(){return this};
$dynamic("assert$html_Node").SVGPolygonElement = function(){return this};
// ********** Code for _SVGPolylineElementImpl **************
$dynamic("is$html_Element").SVGPolylineElement = function(){return true};
$dynamic("assert$html_Element").SVGPolylineElement = function(){return this};
$dynamic("assert$html_Node").SVGPolylineElement = function(){return this};
// ********** Code for _SVGPreserveAspectRatioImpl **************
// ********** Code for _SVGRadialGradientElementImpl **************
$dynamic("is$html_Element").SVGRadialGradientElement = function(){return true};
$dynamic("assert$html_Element").SVGRadialGradientElement = function(){return this};
$dynamic("assert$html_Node").SVGRadialGradientElement = function(){return this};
// ********** Code for _SVGRectImpl **************
// ********** Code for _SVGRectElementImpl **************
$dynamic("is$html_Element").SVGRectElement = function(){return true};
$dynamic("assert$html_Element").SVGRectElement = function(){return this};
$dynamic("assert$html_Node").SVGRectElement = function(){return this};
// ********** Code for _SVGRenderingIntentImpl **************
// ********** Code for _SVGSVGElementImpl **************
$dynamic("is$html_Element").SVGSVGElement = function(){return true};
$dynamic("assert$html_Element").SVGSVGElement = function(){return this};
$dynamic("assert$html_Node").SVGSVGElement = function(){return this};
// ********** Code for _SVGScriptElementImpl **************
$dynamic("is$html_Element").SVGScriptElement = function(){return true};
$dynamic("assert$html_Element").SVGScriptElement = function(){return this};
$dynamic("assert$html_Node").SVGScriptElement = function(){return this};
// ********** Code for _SVGSetElementImpl **************
$dynamic("is$html_Element").SVGSetElement = function(){return true};
$dynamic("assert$html_Element").SVGSetElement = function(){return this};
$dynamic("assert$html_Node").SVGSetElement = function(){return this};
// ********** Code for _SVGStopElementImpl **************
$dynamic("is$html_Element").SVGStopElement = function(){return true};
$dynamic("assert$html_Element").SVGStopElement = function(){return this};
$dynamic("assert$html_Node").SVGStopElement = function(){return this};
// ********** Code for _SVGStringListImpl **************
$dynamic("clear$0").SVGStringList = function() {
  return this.clear();
};
// ********** Code for _SVGStyleElementImpl **************
$dynamic("is$html_Element").SVGStyleElement = function(){return true};
$dynamic("assert$html_Element").SVGStyleElement = function(){return this};
$dynamic("assert$html_Node").SVGStyleElement = function(){return this};
// ********** Code for _SVGSwitchElementImpl **************
$dynamic("is$html_Element").SVGSwitchElement = function(){return true};
$dynamic("assert$html_Element").SVGSwitchElement = function(){return this};
$dynamic("assert$html_Node").SVGSwitchElement = function(){return this};
// ********** Code for _SVGSymbolElementImpl **************
$dynamic("is$html_Element").SVGSymbolElement = function(){return true};
$dynamic("assert$html_Element").SVGSymbolElement = function(){return this};
$dynamic("assert$html_Node").SVGSymbolElement = function(){return this};
// ********** Code for _SVGTRefElementImpl **************
$dynamic("is$html_Element").SVGTRefElement = function(){return true};
$dynamic("assert$html_Element").SVGTRefElement = function(){return this};
$dynamic("assert$html_Node").SVGTRefElement = function(){return this};
// ********** Code for _SVGTSpanElementImpl **************
$dynamic("is$html_Element").SVGTSpanElement = function(){return true};
$dynamic("assert$html_Element").SVGTSpanElement = function(){return this};
$dynamic("assert$html_Node").SVGTSpanElement = function(){return this};
// ********** Code for _SVGTestsImpl **************
// ********** Code for _SVGTextElementImpl **************
$dynamic("is$html_Element").SVGTextElement = function(){return true};
$dynamic("assert$html_Element").SVGTextElement = function(){return this};
$dynamic("assert$html_Node").SVGTextElement = function(){return this};
// ********** Code for _SVGTextPathElementImpl **************
$dynamic("is$html_Element").SVGTextPathElement = function(){return true};
$dynamic("assert$html_Element").SVGTextPathElement = function(){return this};
$dynamic("assert$html_Node").SVGTextPathElement = function(){return this};
// ********** Code for _SVGTitleElementImpl **************
$dynamic("is$html_Element").SVGTitleElement = function(){return true};
$dynamic("assert$html_Element").SVGTitleElement = function(){return this};
$dynamic("assert$html_Node").SVGTitleElement = function(){return this};
// ********** Code for _SVGTransformImpl **************
// ********** Code for _SVGTransformListImpl **************
$dynamic("clear$0").SVGTransformList = function() {
  return this.clear();
};
// ********** Code for _SVGTransformableImpl **************
// ********** Code for _SVGURIReferenceImpl **************
// ********** Code for _SVGUnitTypesImpl **************
// ********** Code for _SVGUseElementImpl **************
$dynamic("is$html_Element").SVGUseElement = function(){return true};
$dynamic("assert$html_Element").SVGUseElement = function(){return this};
$dynamic("assert$html_Node").SVGUseElement = function(){return this};
// ********** Code for _SVGVKernElementImpl **************
$dynamic("is$html_Element").SVGVKernElement = function(){return true};
$dynamic("assert$html_Element").SVGVKernElement = function(){return this};
$dynamic("assert$html_Node").SVGVKernElement = function(){return this};
// ********** Code for _SVGViewElementImpl **************
$dynamic("is$html_Element").SVGViewElement = function(){return true};
$dynamic("assert$html_Element").SVGViewElement = function(){return this};
$dynamic("assert$html_Node").SVGViewElement = function(){return this};
// ********** Code for _SVGZoomAndPanImpl **************
// ********** Code for _SVGViewSpecImpl **************
// ********** Code for _SVGZoomEventImpl **************
// ********** Code for _ScreenImpl **************
// ********** Code for _ScriptElementImpl **************
$dynamic("is$html_Element").HTMLScriptElement = function(){return true};
$dynamic("assert$html_Element").HTMLScriptElement = function(){return this};
$dynamic("assert$html_Node").HTMLScriptElement = function(){return this};
// ********** Code for _ScriptProfileImpl **************
// ********** Code for _ScriptProfileNodeImpl **************
// ********** Code for _SelectElementImpl **************
$dynamic("is$html_Element").HTMLSelectElement = function(){return true};
$dynamic("assert$html_Element").HTMLSelectElement = function(){return this};
$dynamic("assert$html_Node").HTMLSelectElement = function(){return this};
// ********** Code for _ShadowElementImpl **************
$dynamic("is$html_Element").HTMLShadowElement = function(){return true};
$dynamic("assert$html_Element").HTMLShadowElement = function(){return this};
$dynamic("assert$html_Node").HTMLShadowElement = function(){return this};
// ********** Code for _ShadowRootImpl **************
$dynamic("is$html_Element").ShadowRoot = function(){return true};
$dynamic("assert$html_Element").ShadowRoot = function(){return this};
$dynamic("assert$html_Node").ShadowRoot = function(){return this};
$dynamic("set$innerHTML").ShadowRoot = function(value) { return this.innerHTML = value; };
// ********** Code for _SharedWorkerImpl **************
// ********** Code for _SharedWorkerContextImpl **************
// ********** Code for _SourceElementImpl **************
$dynamic("is$html_Element").HTMLSourceElement = function(){return true};
$dynamic("assert$html_Element").HTMLSourceElement = function(){return this};
$dynamic("assert$html_Node").HTMLSourceElement = function(){return this};
// ********** Code for _SpanElementImpl **************
$dynamic("is$html_Element").HTMLSpanElement = function(){return true};
$dynamic("assert$html_Element").HTMLSpanElement = function(){return this};
$dynamic("assert$html_Node").HTMLSpanElement = function(){return this};
// ********** Code for _SpeechGrammarImpl **************
// ********** Code for _SpeechGrammarListImpl **************
// ********** Code for _SpeechInputEventImpl **************
// ********** Code for _SpeechInputResultImpl **************
// ********** Code for _SpeechInputResultListImpl **************
// ********** Code for _SpeechRecognitionAlternativeImpl **************
// ********** Code for _SpeechRecognitionErrorImpl **************
// ********** Code for _SpeechRecognitionEventImpl **************
// ********** Code for _SpeechRecognitionResultImpl **************
// ********** Code for _SpeechRecognitionResultListImpl **************
// ********** Code for _StorageImpl **************
$dynamic("clear$0").Storage = function() {
  return this.clear();
};
// ********** Code for _StorageEventImpl **************
// ********** Code for _StorageInfoImpl **************
// ********** Code for _StyleElementImpl **************
$dynamic("is$html_Element").HTMLStyleElement = function(){return true};
$dynamic("assert$html_Element").HTMLStyleElement = function(){return this};
$dynamic("assert$html_Node").HTMLStyleElement = function(){return this};
// ********** Code for _StyleMediaImpl **************
// ********** Code for _StyleSheetListImpl **************
$dynamic("is$List").StyleSheetList = function(){return true};
$dynamic("assert$List").StyleSheetList = function(){return this};
$dynamic("assert$List_Element").StyleSheetList = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
$dynamic("is$Collection").StyleSheetList = function(){return true};
$dynamic("assert$Collection").StyleSheetList = function(){return this};
$dynamic("assert$Collection_Firework").StyleSheetList = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
$dynamic("assert$Collection_Spark").StyleSheetList = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
$dynamic("assert$Collection_dart_core_Function").StyleSheetList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
$dynamic("assert$Collection_Future").StyleSheetList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
$dynamic("assert$Collection_Object").StyleSheetList = function(){return this};
$dynamic("assert$Collection_String").StyleSheetList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
$dynamic("assert$Collection_int").StyleSheetList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.int>"))};
$dynamic("assert$Collection_num").StyleSheetList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.num>"))};
$dynamic("assert$Collection_ClientRect").StyleSheetList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
$dynamic("assert$Collection_Element").StyleSheetList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
$dynamic("assert$Collection_Node").StyleSheetList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Node>"))};
$dynamic("assert$Collection_StyleSheet").StyleSheetList = function(){return this};
$dynamic("assert$Collection_TimeoutHandler").StyleSheetList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
$dynamic("assert$Collection_Touch").StyleSheetList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
$dynamic("assert$Collection__MeasurementRequest").StyleSheetList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
$dynamic("assert$Collection__NodeImpl").StyleSheetList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
$dynamic("assert$Iterable").StyleSheetList = function(){return this};
$dynamic("get$length").StyleSheetList = function() { return this.length; };
$dynamic("$index").StyleSheetList = function(index) {
  return this[index];
}
$dynamic("$setindex").StyleSheetList = function(index, value) {
  $throw(new UnsupportedOperationException("Cannot assign element of immutable List."));
}
$dynamic("iterator").StyleSheetList = function() {
  return new _FixedSizeListIterator_html_StyleSheet(this);
}
$dynamic("add").StyleSheetList = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addLast").StyleSheetList = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addAll").StyleSheetList = function(collection) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("forEach").StyleSheetList = function(f) {
  return _Collections.forEach(this, f);
}
$dynamic("filter").StyleSheetList = function(f) {
  return _Collections.filter(this, [], f);
}
$dynamic("isEmpty").StyleSheetList = function() {
  return this.length == (0);
}
$dynamic("last").StyleSheetList = function() {
  return this.$index(this.length - (1));
}
$dynamic("removeRange").StyleSheetList = function(start, length) {
  $throw(new UnsupportedOperationException("Cannot removeRange on immutable List."));
}
$dynamic("getRange").StyleSheetList = function(start, length) {
  return _Lists.getRange(this, start, length, []);
}
$dynamic("add$1").StyleSheetList = function($0) {
  return this.add(($0 == null ? null : $0.assert$html_StyleSheet()));
};
$dynamic("addAll$1").StyleSheetList = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_StyleSheet()));
};
$dynamic("addLast$1").StyleSheetList = function($0) {
  return this.addLast(($0 == null ? null : $0.assert$html_StyleSheet()));
};
$dynamic("forEach$1").StyleSheetList = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _TableCaptionElementImpl **************
$dynamic("is$html_Element").HTMLTableCaptionElement = function(){return true};
$dynamic("assert$html_Element").HTMLTableCaptionElement = function(){return this};
$dynamic("assert$html_Node").HTMLTableCaptionElement = function(){return this};
// ********** Code for _TableCellElementImpl **************
$dynamic("is$html_Element").HTMLTableCellElement = function(){return true};
$dynamic("assert$html_Element").HTMLTableCellElement = function(){return this};
$dynamic("assert$html_Node").HTMLTableCellElement = function(){return this};
// ********** Code for _TableColElementImpl **************
$dynamic("is$html_Element").HTMLTableColElement = function(){return true};
$dynamic("assert$html_Element").HTMLTableColElement = function(){return this};
$dynamic("assert$html_Node").HTMLTableColElement = function(){return this};
// ********** Code for _TableElementImpl **************
$dynamic("is$html_Element").HTMLTableElement = function(){return true};
$dynamic("assert$html_Element").HTMLTableElement = function(){return this};
$dynamic("assert$html_Node").HTMLTableElement = function(){return this};
// ********** Code for _TableRowElementImpl **************
$dynamic("is$html_Element").HTMLTableRowElement = function(){return true};
$dynamic("assert$html_Element").HTMLTableRowElement = function(){return this};
$dynamic("assert$html_Node").HTMLTableRowElement = function(){return this};
// ********** Code for _TableSectionElementImpl **************
$dynamic("is$html_Element").HTMLTableSectionElement = function(){return true};
$dynamic("assert$html_Element").HTMLTableSectionElement = function(){return this};
$dynamic("assert$html_Node").HTMLTableSectionElement = function(){return this};
// ********** Code for _TextAreaElementImpl **************
$dynamic("is$html_Element").HTMLTextAreaElement = function(){return true};
$dynamic("assert$html_Element").HTMLTextAreaElement = function(){return this};
$dynamic("assert$html_Node").HTMLTextAreaElement = function(){return this};
// ********** Code for _TextEventImpl **************
// ********** Code for _TextMetricsImpl **************
// ********** Code for _TextTrackImpl **************
// ********** Code for _TextTrackCueImpl **************
$dynamic("get$text").TextTrackCue = function() { return this.text; };
// ********** Code for _TextTrackCueListImpl **************
// ********** Code for _TextTrackListImpl **************
// ********** Code for _TimeRangesImpl **************
// ********** Code for _TitleElementImpl **************
$dynamic("is$html_Element").HTMLTitleElement = function(){return true};
$dynamic("assert$html_Element").HTMLTitleElement = function(){return this};
$dynamic("assert$html_Node").HTMLTitleElement = function(){return this};
// ********** Code for _TouchImpl **************
$dynamic("assert$html_Touch").Touch = function(){return this};
// ********** Code for _TouchEventImpl **************
// ********** Code for _TouchListImpl **************
$dynamic("is$List").TouchList = function(){return true};
$dynamic("assert$List").TouchList = function(){return this};
$dynamic("assert$List_Element").TouchList = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
$dynamic("is$Collection").TouchList = function(){return true};
$dynamic("assert$Collection").TouchList = function(){return this};
$dynamic("assert$Collection_Firework").TouchList = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
$dynamic("assert$Collection_Spark").TouchList = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
$dynamic("assert$Collection_dart_core_Function").TouchList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
$dynamic("assert$Collection_Future").TouchList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
$dynamic("assert$Collection_Object").TouchList = function(){return this};
$dynamic("assert$Collection_String").TouchList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
$dynamic("assert$Collection_int").TouchList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.int>"))};
$dynamic("assert$Collection_num").TouchList = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.num>"))};
$dynamic("assert$Collection_ClientRect").TouchList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
$dynamic("assert$Collection_Element").TouchList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
$dynamic("assert$Collection_Node").TouchList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Node>"))};
$dynamic("assert$Collection_StyleSheet").TouchList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
$dynamic("assert$Collection_TimeoutHandler").TouchList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
$dynamic("assert$Collection_Touch").TouchList = function(){return this};
$dynamic("assert$Collection__MeasurementRequest").TouchList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
$dynamic("assert$Collection__NodeImpl").TouchList = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
$dynamic("assert$Iterable").TouchList = function(){return this};
$dynamic("get$length").TouchList = function() { return this.length; };
$dynamic("$index").TouchList = function(index) {
  return this[index];
}
$dynamic("$setindex").TouchList = function(index, value) {
  $throw(new UnsupportedOperationException("Cannot assign element of immutable List."));
}
$dynamic("iterator").TouchList = function() {
  return new _FixedSizeListIterator_html_Touch(this);
}
$dynamic("add").TouchList = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addLast").TouchList = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addAll").TouchList = function(collection) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("forEach").TouchList = function(f) {
  return _Collections.forEach(this, f);
}
$dynamic("filter").TouchList = function(f) {
  return _Collections.filter(this, [], f);
}
$dynamic("isEmpty").TouchList = function() {
  return this.length == (0);
}
$dynamic("last").TouchList = function() {
  return this.$index(this.length - (1));
}
$dynamic("removeRange").TouchList = function(start, length) {
  $throw(new UnsupportedOperationException("Cannot removeRange on immutable List."));
}
$dynamic("getRange").TouchList = function(start, length) {
  return _Lists.getRange(this, start, length, []);
}
$dynamic("add$1").TouchList = function($0) {
  return this.add(($0 == null ? null : $0.assert$html_Touch()));
};
$dynamic("addAll$1").TouchList = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_Touch()));
};
$dynamic("addLast$1").TouchList = function($0) {
  return this.addLast(($0 == null ? null : $0.assert$html_Touch()));
};
$dynamic("forEach$1").TouchList = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _TrackElementImpl **************
$dynamic("is$html_Element").HTMLTrackElement = function(){return true};
$dynamic("assert$html_Element").HTMLTrackElement = function(){return this};
$dynamic("assert$html_Node").HTMLTrackElement = function(){return this};
// ********** Code for _TrackEventImpl **************
// ********** Code for _TransitionEventImpl **************
// ********** Code for _TreeWalkerImpl **************
// ********** Code for _UListElementImpl **************
$dynamic("is$html_Element").HTMLUListElement = function(){return true};
$dynamic("assert$html_Element").HTMLUListElement = function(){return this};
$dynamic("assert$html_Node").HTMLUListElement = function(){return this};
// ********** Code for _Uint16ArrayImpl **************
var _Uint16ArrayImpl = {};
$dynamic("is$List").Uint16Array = function(){return true};
$dynamic("assert$List").Uint16Array = function(){return this};
$dynamic("assert$List_Element").Uint16Array = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
$dynamic("is$Collection").Uint16Array = function(){return true};
$dynamic("assert$Collection").Uint16Array = function(){return this};
$dynamic("assert$Collection_Firework").Uint16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
$dynamic("assert$Collection_Spark").Uint16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
$dynamic("assert$Collection_dart_core_Function").Uint16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
$dynamic("assert$Collection_Future").Uint16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
$dynamic("assert$Collection_Object").Uint16Array = function(){return this};
$dynamic("assert$Collection_String").Uint16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
$dynamic("assert$Collection_int").Uint16Array = function(){return this};
$dynamic("assert$Collection_num").Uint16Array = function(){return this};
$dynamic("assert$Collection_ClientRect").Uint16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
$dynamic("assert$Collection_Element").Uint16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
$dynamic("assert$Collection_Node").Uint16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Node>"))};
$dynamic("assert$Collection_StyleSheet").Uint16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
$dynamic("assert$Collection_TimeoutHandler").Uint16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
$dynamic("assert$Collection_Touch").Uint16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
$dynamic("assert$Collection__MeasurementRequest").Uint16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
$dynamic("assert$Collection__NodeImpl").Uint16Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
$dynamic("assert$Iterable").Uint16Array = function(){return this};
$dynamic("get$length").Uint16Array = function() { return this.length; };
$dynamic("$index").Uint16Array = function(index) {
  return this[index];
}
$dynamic("$setindex").Uint16Array = function(index, value) {
  this[index] = value
}
$dynamic("iterator").Uint16Array = function() {
  return new _FixedSizeListIterator_int(this);
}
$dynamic("add").Uint16Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addLast").Uint16Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addAll").Uint16Array = function(collection) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("forEach").Uint16Array = function(f) {
  return _Collections.forEach(this, f);
}
$dynamic("filter").Uint16Array = function(f) {
  return _Collections.filter(this, [], f);
}
$dynamic("isEmpty").Uint16Array = function() {
  return this.length == (0);
}
$dynamic("last").Uint16Array = function() {
  return this.$index(this.length - (1));
}
$dynamic("removeRange").Uint16Array = function(start, length) {
  $throw(new UnsupportedOperationException("Cannot removeRange on immutable List."));
}
$dynamic("getRange").Uint16Array = function(start, length) {
  return _Lists.getRange(this, start, length, []);
}
$dynamic("add$1").Uint16Array = function($0) {
  return this.add($assert_num($0));
};
$dynamic("addAll$1").Uint16Array = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_int()));
};
$dynamic("addLast$1").Uint16Array = function($0) {
  return this.addLast($assert_num($0));
};
$dynamic("forEach$1").Uint16Array = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _Uint32ArrayImpl **************
var _Uint32ArrayImpl = {};
$dynamic("is$List").Uint32Array = function(){return true};
$dynamic("assert$List").Uint32Array = function(){return this};
$dynamic("assert$List_Element").Uint32Array = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
$dynamic("is$Collection").Uint32Array = function(){return true};
$dynamic("assert$Collection").Uint32Array = function(){return this};
$dynamic("assert$Collection_Firework").Uint32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
$dynamic("assert$Collection_Spark").Uint32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
$dynamic("assert$Collection_dart_core_Function").Uint32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
$dynamic("assert$Collection_Future").Uint32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
$dynamic("assert$Collection_Object").Uint32Array = function(){return this};
$dynamic("assert$Collection_String").Uint32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
$dynamic("assert$Collection_int").Uint32Array = function(){return this};
$dynamic("assert$Collection_num").Uint32Array = function(){return this};
$dynamic("assert$Collection_ClientRect").Uint32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
$dynamic("assert$Collection_Element").Uint32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
$dynamic("assert$Collection_Node").Uint32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Node>"))};
$dynamic("assert$Collection_StyleSheet").Uint32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
$dynamic("assert$Collection_TimeoutHandler").Uint32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
$dynamic("assert$Collection_Touch").Uint32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
$dynamic("assert$Collection__MeasurementRequest").Uint32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
$dynamic("assert$Collection__NodeImpl").Uint32Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
$dynamic("assert$Iterable").Uint32Array = function(){return this};
$dynamic("get$length").Uint32Array = function() { return this.length; };
$dynamic("$index").Uint32Array = function(index) {
  return this[index];
}
$dynamic("$setindex").Uint32Array = function(index, value) {
  this[index] = value
}
$dynamic("iterator").Uint32Array = function() {
  return new _FixedSizeListIterator_int(this);
}
$dynamic("add").Uint32Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addLast").Uint32Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addAll").Uint32Array = function(collection) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("forEach").Uint32Array = function(f) {
  return _Collections.forEach(this, f);
}
$dynamic("filter").Uint32Array = function(f) {
  return _Collections.filter(this, [], f);
}
$dynamic("isEmpty").Uint32Array = function() {
  return this.length == (0);
}
$dynamic("last").Uint32Array = function() {
  return this.$index(this.length - (1));
}
$dynamic("removeRange").Uint32Array = function(start, length) {
  $throw(new UnsupportedOperationException("Cannot removeRange on immutable List."));
}
$dynamic("getRange").Uint32Array = function(start, length) {
  return _Lists.getRange(this, start, length, []);
}
$dynamic("add$1").Uint32Array = function($0) {
  return this.add($assert_num($0));
};
$dynamic("addAll$1").Uint32Array = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_int()));
};
$dynamic("addLast$1").Uint32Array = function($0) {
  return this.addLast($assert_num($0));
};
$dynamic("forEach$1").Uint32Array = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _Uint8ArrayImpl **************
var _Uint8ArrayImpl = {};
$dynamic("is$List").Uint8Array = function(){return true};
$dynamic("assert$List").Uint8Array = function(){return this};
$dynamic("assert$List_Element").Uint8Array = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
$dynamic("is$Collection").Uint8Array = function(){return true};
$dynamic("assert$Collection").Uint8Array = function(){return this};
$dynamic("assert$Collection_Firework").Uint8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
$dynamic("assert$Collection_Spark").Uint8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
$dynamic("assert$Collection_dart_core_Function").Uint8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
$dynamic("assert$Collection_Future").Uint8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
$dynamic("assert$Collection_Object").Uint8Array = function(){return this};
$dynamic("assert$Collection_String").Uint8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
$dynamic("assert$Collection_int").Uint8Array = function(){return this};
$dynamic("assert$Collection_num").Uint8Array = function(){return this};
$dynamic("assert$Collection_ClientRect").Uint8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
$dynamic("assert$Collection_Element").Uint8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
$dynamic("assert$Collection_Node").Uint8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Node>"))};
$dynamic("assert$Collection_StyleSheet").Uint8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
$dynamic("assert$Collection_TimeoutHandler").Uint8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
$dynamic("assert$Collection_Touch").Uint8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
$dynamic("assert$Collection__MeasurementRequest").Uint8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
$dynamic("assert$Collection__NodeImpl").Uint8Array = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
$dynamic("assert$Iterable").Uint8Array = function(){return this};
$dynamic("get$length").Uint8Array = function() { return this.length; };
$dynamic("$index").Uint8Array = function(index) {
  return this[index];
}
$dynamic("$setindex").Uint8Array = function(index, value) {
  this[index] = value
}
$dynamic("iterator").Uint8Array = function() {
  return new _FixedSizeListIterator_int(this);
}
$dynamic("add").Uint8Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addLast").Uint8Array = function(value) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("addAll").Uint8Array = function(collection) {
  $throw(new UnsupportedOperationException("Cannot add to immutable List."));
}
$dynamic("forEach").Uint8Array = function(f) {
  return _Collections.forEach(this, f);
}
$dynamic("filter").Uint8Array = function(f) {
  return _Collections.filter(this, [], f);
}
$dynamic("isEmpty").Uint8Array = function() {
  return this.length == (0);
}
$dynamic("last").Uint8Array = function() {
  return this.$index(this.length - (1));
}
$dynamic("removeRange").Uint8Array = function(start, length) {
  $throw(new UnsupportedOperationException("Cannot removeRange on immutable List."));
}
$dynamic("getRange").Uint8Array = function(start, length) {
  return _Lists.getRange(this, start, length, []);
}
$dynamic("add$1").Uint8Array = function($0) {
  return this.add($assert_num($0));
};
$dynamic("addAll$1").Uint8Array = function($0) {
  return this.addAll(($0 == null ? null : $0.assert$Collection_int()));
};
$dynamic("addLast$1").Uint8Array = function($0) {
  return this.addLast($assert_num($0));
};
$dynamic("forEach$1").Uint8Array = function($0) {
  return this.forEach(to$call$1($0));
};
// ********** Code for _Uint8ClampedArrayImpl **************
var _Uint8ClampedArrayImpl = {};
$dynamic("is$List").Uint8ClampedArray = function(){return true};
$dynamic("assert$List").Uint8ClampedArray = function(){return this};
$dynamic("assert$List_Element").Uint8ClampedArray = function(){$throw(new TypeError._internal$ctor(this, "List<html.Element>"))};
$dynamic("is$Collection").Uint8ClampedArray = function(){return true};
$dynamic("assert$Collection").Uint8ClampedArray = function(){return this};
$dynamic("assert$Collection_Firework").Uint8ClampedArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Firework>"))};
$dynamic("assert$Collection_Spark").Uint8ClampedArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<Fireworks.Spark>"))};
$dynamic("assert$Collection_dart_core_Function").Uint8ClampedArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Function>"))};
$dynamic("assert$Collection_Future").Uint8ClampedArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.Future>"))};
$dynamic("assert$Collection_Object").Uint8ClampedArray = function(){return this};
$dynamic("assert$Collection_String").Uint8ClampedArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<dart:core.String>"))};
$dynamic("assert$Collection_int").Uint8ClampedArray = function(){return this};
$dynamic("assert$Collection_num").Uint8ClampedArray = function(){return this};
$dynamic("assert$Collection_ClientRect").Uint8ClampedArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.ClientRect>"))};
$dynamic("assert$Collection_Element").Uint8ClampedArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Element>"))};
$dynamic("assert$Collection_Node").Uint8ClampedArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Node>"))};
$dynamic("assert$Collection_StyleSheet").Uint8ClampedArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.StyleSheet>"))};
$dynamic("assert$Collection_TimeoutHandler").Uint8ClampedArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.TimeoutHandler>"))};
$dynamic("assert$Collection_Touch").Uint8ClampedArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<html.Touch>"))};
$dynamic("assert$Collection__MeasurementRequest").Uint8ClampedArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._MeasurementRequest>"))};
$dynamic("assert$Collection__NodeImpl").Uint8ClampedArray = function(){$throw(new TypeError._internal$ctor(this, "Collection<html._NodeImpl>"))};
$dynamic("assert$Iterable").Uint8ClampedArray = function(){return this};
// ********** Code for _UnknownElementImpl **************
$dynamic("is$html_Element").HTMLUnknownElement = function(){return true};
$dynamic("assert$html_Element").HTMLUnknownElement = function(){return this};
$dynamic("assert$html_Node").HTMLUnknownElement = function(){return this};
// ********** Code for _ValidityStateImpl **************
// ********** Code for _VideoElementImpl **************
$dynamic("is$html_Element").HTMLVideoElement = function(){return true};
$dynamic("assert$html_Element").HTMLVideoElement = function(){return this};
$dynamic("assert$html_Node").HTMLVideoElement = function(){return this};
// ********** Code for _WaveShaperNodeImpl **************
// ********** Code for _WebGLActiveInfoImpl **************
// ********** Code for _WebGLBufferImpl **************
// ********** Code for _WebGLCompressedTextureS3TCImpl **************
// ********** Code for _WebGLContextAttributesImpl **************
// ********** Code for _WebGLContextEventImpl **************
// ********** Code for _WebGLDebugRendererInfoImpl **************
// ********** Code for _WebGLDebugShadersImpl **************
// ********** Code for _WebGLFramebufferImpl **************
// ********** Code for _WebGLLoseContextImpl **************
// ********** Code for _WebGLProgramImpl **************
// ********** Code for _WebGLRenderbufferImpl **************
// ********** Code for _WebGLRenderingContextImpl **************
// ********** Code for _WebGLShaderImpl **************
// ********** Code for _WebGLTextureImpl **************
// ********** Code for _WebGLUniformLocationImpl **************
// ********** Code for _WebGLVertexArrayObjectOESImpl **************
// ********** Code for _WebKitCSSRegionRuleImpl **************
// ********** Code for _WebKitNamedFlowImpl **************
// ********** Code for _WebSocketImpl **************
$dynamic("_addEventListener").WebSocket = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _WheelEventImpl **************
// ********** Code for _WindowImpl **************
$dynamic("get$on").DOMWindow = function() {
  return new _WindowEventsImpl(this);
}
$dynamic("get$top").DOMWindow = function() { return this.top; };
$dynamic("_addEventListener").DOMWindow = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _WindowEventsImpl **************
$inherits(_WindowEventsImpl, _EventsImpl);
function _WindowEventsImpl(_ptr) {
  _EventsImpl.call(this, _ptr);
}
_WindowEventsImpl.prototype.get$message = function() {
  return this._get("message");
}
_WindowEventsImpl.prototype.get$mouseDown = function() {
  return this._get("mousedown");
}
_WindowEventsImpl.prototype.get$touchStart = function() {
  return this._get("touchstart");
}
// ********** Code for _WorkerImpl **************
// ********** Code for _WorkerLocationImpl **************
// ********** Code for _WorkerNavigatorImpl **************
// ********** Code for _XMLHttpRequestImpl **************
$dynamic("_addEventListener").XMLHttpRequest = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _XMLHttpRequestExceptionImpl **************
// ********** Code for _XMLHttpRequestProgressEventImpl **************
// ********** Code for _XMLHttpRequestUploadImpl **************
$dynamic("_addEventListener").XMLHttpRequestUpload = function(type, listener, useCapture) {
  this.addEventListener(type, listener, useCapture);
}
// ********** Code for _XMLSerializerImpl **************
// ********** Code for _XPathEvaluatorImpl **************
// ********** Code for _XPathExceptionImpl **************
// ********** Code for _XPathExpressionImpl **************
// ********** Code for _XPathNSResolverImpl **************
// ********** Code for _XPathResultImpl **************
// ********** Code for _XSLTProcessorImpl **************
// ********** Code for _Collections **************
function _Collections() {}
_Collections.forEach = function(iterable, f) {
  for (var $$i = iterable.iterator(); $$i.hasNext(); ) {
    var e = $$i.next();
    f(e);
  }
}
_Collections.filter = function(source, destination, f) {
  for (var $$i = source.iterator(); $$i.hasNext(); ) {
    var e = $$i.next();
    if (f(e)) destination.add$1(e);
  }
  return destination;
}
// ********** Code for _MeasurementRequest **************
function _MeasurementRequest(computeValue, completer) {
  this.exception = false;
  this.computeValue = computeValue;
  this.completer = completer;
}
_MeasurementRequest.prototype.assert$_MeasurementRequest = function(){return this};
// ********** Code for _ElementFactoryProvider **************
function _ElementFactoryProvider() {}
_ElementFactoryProvider.Element$tag$factory = function(tag) {
  return get$$_document()._createElement(tag);
}
// ********** Code for _VariableSizeListIterator **************
function _VariableSizeListIterator() {}
_VariableSizeListIterator.prototype.assert$Iterator = function(){return this};
_VariableSizeListIterator.prototype.assert$Iterator_Element = function(){return this};
_VariableSizeListIterator.prototype.hasNext = function() {
  return this._html_array.get$length() > this._html_pos;
}
_VariableSizeListIterator.prototype.next = function() {
  if (!this.hasNext()) {
    $throw(const$0001);
  }
  return this._html_array.$index(this._html_pos++);
}
// ********** Code for _FixedSizeListIterator **************
$inherits(_FixedSizeListIterator, _VariableSizeListIterator);
function _FixedSizeListIterator() {}
_FixedSizeListIterator.prototype.hasNext = function() {
  return this._html_length > this._html_pos;
}
// ********** Code for _VariableSizeListIterator_dart_core_String **************
$inherits(_VariableSizeListIterator_dart_core_String, _VariableSizeListIterator);
function _VariableSizeListIterator_dart_core_String(array) {
  this._html_array = array;
  this._html_pos = (0);
}
_VariableSizeListIterator_dart_core_String.prototype.assert$Iterator = function(){return this};
_VariableSizeListIterator_dart_core_String.prototype.assert$Iterator_Element = function(){$throw(new TypeError._internal$ctor(this, "Iterator<html.Element>"))};
// ********** Code for _FixedSizeListIterator_dart_core_String **************
$inherits(_FixedSizeListIterator_dart_core_String, _FixedSizeListIterator);
function _FixedSizeListIterator_dart_core_String(array) {
  this._html_length = array.get$length();
  _VariableSizeListIterator_dart_core_String.call(this, array);
}
// ********** Code for _VariableSizeListIterator_int **************
$inherits(_VariableSizeListIterator_int, _VariableSizeListIterator);
function _VariableSizeListIterator_int(array) {
  this._html_array = array;
  this._html_pos = (0);
}
_VariableSizeListIterator_int.prototype.assert$Iterator = function(){return this};
_VariableSizeListIterator_int.prototype.assert$Iterator_Element = function(){$throw(new TypeError._internal$ctor(this, "Iterator<html.Element>"))};
// ********** Code for _FixedSizeListIterator_int **************
$inherits(_FixedSizeListIterator_int, _FixedSizeListIterator);
function _FixedSizeListIterator_int(array) {
  this._html_length = array.get$length();
  _VariableSizeListIterator_int.call(this, array);
}
// ********** Code for _VariableSizeListIterator_num **************
$inherits(_VariableSizeListIterator_num, _VariableSizeListIterator);
function _VariableSizeListIterator_num(array) {
  this._html_array = array;
  this._html_pos = (0);
}
_VariableSizeListIterator_num.prototype.assert$Iterator = function(){return this};
_VariableSizeListIterator_num.prototype.assert$Iterator_Element = function(){$throw(new TypeError._internal$ctor(this, "Iterator<html.Element>"))};
// ********** Code for _FixedSizeListIterator_num **************
$inherits(_FixedSizeListIterator_num, _FixedSizeListIterator);
function _FixedSizeListIterator_num(array) {
  this._html_length = array.get$length();
  _VariableSizeListIterator_num.call(this, array);
}
// ********** Code for _VariableSizeListIterator_html_Node **************
$inherits(_VariableSizeListIterator_html_Node, _VariableSizeListIterator);
function _VariableSizeListIterator_html_Node(array) {
  this._html_array = array;
  this._html_pos = (0);
}
_VariableSizeListIterator_html_Node.prototype.assert$Iterator = function(){return this};
_VariableSizeListIterator_html_Node.prototype.assert$Iterator_Element = function(){$throw(new TypeError._internal$ctor(this, "Iterator<html.Element>"))};
// ********** Code for _FixedSizeListIterator_html_Node **************
$inherits(_FixedSizeListIterator_html_Node, _FixedSizeListIterator);
function _FixedSizeListIterator_html_Node(array) {
  this._html_length = array.get$length();
  _VariableSizeListIterator_html_Node.call(this, array);
}
// ********** Code for _VariableSizeListIterator_html_StyleSheet **************
$inherits(_VariableSizeListIterator_html_StyleSheet, _VariableSizeListIterator);
function _VariableSizeListIterator_html_StyleSheet(array) {
  this._html_array = array;
  this._html_pos = (0);
}
_VariableSizeListIterator_html_StyleSheet.prototype.assert$Iterator = function(){return this};
_VariableSizeListIterator_html_StyleSheet.prototype.assert$Iterator_Element = function(){$throw(new TypeError._internal$ctor(this, "Iterator<html.Element>"))};
// ********** Code for _FixedSizeListIterator_html_StyleSheet **************
$inherits(_FixedSizeListIterator_html_StyleSheet, _FixedSizeListIterator);
function _FixedSizeListIterator_html_StyleSheet(array) {
  this._html_length = array.get$length();
  _VariableSizeListIterator_html_StyleSheet.call(this, array);
}
// ********** Code for _VariableSizeListIterator_html_Touch **************
$inherits(_VariableSizeListIterator_html_Touch, _VariableSizeListIterator);
function _VariableSizeListIterator_html_Touch(array) {
  this._html_array = array;
  this._html_pos = (0);
}
_VariableSizeListIterator_html_Touch.prototype.assert$Iterator = function(){return this};
_VariableSizeListIterator_html_Touch.prototype.assert$Iterator_Element = function(){$throw(new TypeError._internal$ctor(this, "Iterator<html.Element>"))};
// ********** Code for _FixedSizeListIterator_html_Touch **************
$inherits(_FixedSizeListIterator_html_Touch, _FixedSizeListIterator);
function _FixedSizeListIterator_html_Touch(array) {
  this._html_length = array.get$length();
  _VariableSizeListIterator_html_Touch.call(this, array);
}
// ********** Code for _Lists **************
function _Lists() {}
_Lists.getRange = function(a, start, length, accumulator) {
  if (length < (0)) $throw(new IllegalArgumentException("length"));
  if (start < (0)) $throw(new IndexOutOfRangeException(start));
  var end = start + length;
  if (end > a.get$length()) $throw(new IndexOutOfRangeException(end));
  for (var i = start;
   i < end; i++) {
    accumulator.add$1(a.$index(i));
  }
  return accumulator;
}
// ********** Code for top level **************
var _cachedWindow;
var _cachedDocument;
function _init() {
  $globals._cachedDocument = get$$_document();
  $globals._cachedWindow = get$$_window();
  var element = _ElementFactoryProvider.Element$tag$factory("body");
  element.set$innerHTML("f");
  if (element.get$text() == "") {
    $globals._cachedWindow.console.error("Cannot import dart:html and dart:dom within the same application.");
    $throw(new UnsupportedOperationException("Cannot import dart:html and dart:dom within the same application."));
  }
}
function get$$window() {
  if ($globals._cachedWindow == null) {
    _init();
  }
  return $globals._cachedWindow;
}
function get$$_window() {
  return window;
}
function get$$document() {
  if ($globals._cachedDocument == null) {
    _init();
  }
  return $globals._cachedDocument;
}
function get$$_document() {
  return window.document.documentElement;
}
var _cachedBrowserPrefix;
var _pendingRequests;
var _pendingMeasurementFrameCallbacks;
function _maybeScheduleMeasurementFrame() {
  if ($globals._nextMeasurementFrameScheduled) return;
  $globals._nextMeasurementFrameScheduled = true;
  if ($globals._firstMeasurementRequest) {
    get$$window().get$on().get$message().add((function (e) {
      return _completeMeasurementFutures();
    })
    , false);
    $globals._firstMeasurementRequest = false;
  }
  get$$window().postMessage("DART-MEASURE", "*");
}
function _createMeasurementFuture(computeValue, completer) {
  var $0;
  if (null == $globals._pendingRequests) {
    $globals._pendingRequests = [];
    _maybeScheduleMeasurementFrame();
  }
  $globals._pendingRequests.add(new _MeasurementRequest(computeValue, completer));
  return (($0 = completer.get$future()) == null ? null : $0.assert$Future());
}
function _completeMeasurementFutures() {
  if ($eq$($globals._nextMeasurementFrameScheduled, false)) {
    return;
  }
  $globals._nextMeasurementFrameScheduled = false;
  if (null != $globals._pendingRequests) {
    var $$list = $globals._pendingRequests;
    for (var $$i = $$list.iterator(); $$i.hasNext(); ) {
      var request = $$i.next();
      try {
        request.value = request.computeValue();
      } catch (e) {
        e = _toDartException(e);
        request.value = e;
        request.exception = true;
      }
    }
  }
  var completedRequests = $globals._pendingRequests;
  var readyMeasurementFrameCallbacks = $globals._pendingMeasurementFrameCallbacks;
  $globals._pendingRequests = null;
  $globals._pendingMeasurementFrameCallbacks = null;
  if (null != completedRequests) {
    for (var $$i = completedRequests.iterator(); $$i.hasNext(); ) {
      var request = $$i.next();
      if (request.exception) {
        request.completer.completeException(request.value);
      }
      else {
        request.completer.complete$1(request.value);
      }
    }
  }
  if (null != readyMeasurementFrameCallbacks) {
    for (var $$i = readyMeasurementFrameCallbacks.iterator(); $$i.hasNext(); ) {
      var handler = $$i.next();
      handler();
    }
  }
}
//  ********** Library Fireworks **************
// ********** Code for Random **************
function Random() {}
Random.next = function() {
  $globals.Random_x = $globals.Random_x * (25214903917) + (11);
  $globals.Random_x = $mod$($globals.Random_x, (281474976710655));
  return $globals.Random_x * (3.552713678800501e-15);
}
// ********** Code for Spark **************
function Spark(posX, posY, size) {
  this.posX = posX;
  this.posY = posY;
  this.size = size;
  var angle = random() * (6.283185307179586);
  var velocity = random() * (6.0);
  this.velX = Math.cos(angle) * velocity;
  this.velY = Math.sin(angle) * velocity;
}
Spark.prototype.assert$Spark = function(){return this};
Spark.prototype.draw = function(view, color) {
  this.posX = this.posX + this.velX;
  this.posY = this.posY + this.velY;
  this.velX = this.velX * (0.98);
  this.velY = this.velY * (0.98);
  this.size = this.size * (0.98);
  this.posY = this.posY + (2.0);
  view.cx.beginPath();
  view.cx.arc(this.posX, this.posY, this.size, (0), (6.283185307179586), true);
  view.cx.fillStyle = color;
  view.cx.fill();
  if (this.size <= (0.1)) return true;
  if (this.posX <= (0) || this.posY <= (0)) return true;
  if (this.posX >= view.width || this.posY >= view.height) return true;
  return false;
}
// ********** Code for Firework **************
function Firework(view, x, y) {
  this.view = view;
  this.color = randomColor();
  this.sparks = new Array();
  for (var i = (0);
   i < (360); ++i) {
    this.sparks.add(new Spark(x, y, (2.0)));
  }
}
Firework.prototype.assert$Firework = function(){return this};
Firework.prototype.update = function(cx) {
  var $0;
  for (var i = (0);
   i < this.sparks.get$length(); ++i) {
    var s = (($0 = this.sparks.$index(i)) == null ? null : $0.assert$Spark());
    if (s.draw(this.view, this.color)) {
      this.sparks.removeRange(i, (1));
    }
  }
}
Firework.prototype.dismissed = function() {
  return this.sparks.isEmpty();
}
// ********** Code for FireworkView **************
function FireworkView(canvas) {
  var $this = this; // closure support
  var $0;
  this.numSparks = (0);
  this.fireworks = new Array();
  this.cx = (($0 = canvas.getContext("2d")) == null ? null : $0.assert$html_CanvasRenderingContext2D());
  this.width = canvas.width;
  this.height = canvas.height;
  canvas.get$rect().then((function (rect) {
    $this.left = $assert_num(rect.get$bounding().get$left());
    $this.top = $assert_num(rect.get$bounding().get$top());
    canvas.get$on().get$mouseDown().add((function (e) {
      $this.explode(e.clientX, e.clientY);
    })
    , false);
    canvas.get$on().get$touchStart().add((function (e) {
      $this.explode(e.touches.$index((0)).pageX, e.touches.$index((1)).pageY);
    })
    , false);
    for (var i = (0);
     i < (3); i++) {
      $this.explode(random() * canvas.width, (canvas.height / (4)).toInt());
    }
  })
  );
}
FireworkView.prototype.get$left = function() { return this.left; };
FireworkView.prototype.get$top = function() { return this.top; };
FireworkView.prototype.explode = function(x, y) {
  this.fireworks.add(new Firework(this, x - this.left, y - this.top));
}
FireworkView.prototype.update = function() {
  var $0;
  if (this.fireworks.isEmpty()) return;
  this.numSparks = (0);
  for (var i = (0);
   i < this.fireworks.get$length(); ++i) {
    var fw = (($0 = this.fireworks.$index(i)) == null ? null : $0.assert$Firework());
    fw.update(this.cx);
    if (fw.dismissed()) {
      this.fireworks.removeRange(i, (1));
    }
    else {
      this.numSparks = this.numSparks + fw.sparks.get$length();
    }
  }
  this.cx.fillStyle = "rgba(0, 0, 0, 0.3)";
  this.cx.fillRect((0), (0), this.width, this.height);
}
// ********** Code for FPSWatcher **************
function FPSWatcher() {
  this.watch = new StopwatchImplementation.start$ctor();
  this.fps = (0);
}
FPSWatcher.prototype.update = function(numSparks) {
  ++this.fps;
  if (this.watch.elapsedInMs() >= (1000)) {
    var message = ("FPS: " + this.fps + " (sparks: " + numSparks + ")");
    get$$document().query("#fps").set$innerHTML(message);
    if (numSparks > (0)) print$(message);
    this.watch.reset();
    this.fps = (0);
  }
}
// ********** Code for top level **************
function random() {
  return Random.next();
}
function randomColor() {
  var rgb = new Array((3));
  for (var i = (0);
   i < rgb.get$length(); ++i) {
    rgb.$setindex(i, (random() * (255) + (60)).toInt());
  }
  return ("rgb(" + rgb.$index((0)) + "," + rgb.$index((1)) + "," + rgb.$index((2)) + ")");
}
function main() {
  var $0;
  var canvas = (($0 = get$$document().query("#night-sky")) == null ? null : $0.assert$CanvasElement());
  var view = new FireworkView(canvas);
  var watcher = new FPSWatcher();
  get$$window().setInterval((function () {
    view.update();
    watcher.update(view.numSparks);
  })
  , (0));
}
// 217 dynamic types.
// 224 types
// 20 !leaf
function $dynamicSetMetadata(inputTable) {
  // TODO: Deal with light isolates.
  var table = [];
  for (var i = 0; i < inputTable.length; i++) {
    var tag = inputTable[i][0];
    var tags = inputTable[i][1];
    var map = {};
    var tagNames = tags.split('|');
    for (var j = 0; j < tagNames.length; j++) {
      map[tagNames[j]] = true;
    }
    table.push({tag: tag, tags: tags, map: map});
  }
  $dynamicMetadata = table;
}
(function(){
  var v0/*Text*/ = 'Text|CDATASection';
  var v1/*SVGTextPositioningElement*/ = 'SVGTextPositioningElement|SVGAltGlyphElement|SVGTRefElement|SVGTSpanElement|SVGTextElement';
  var v2/*SVGAnimationElement*/ = 'SVGAnimationElement|SVGAnimateColorElement|SVGAnimateElement|SVGAnimateMotionElement|SVGAnimateTransformElement|SVGSetElement';
  var v3/*SVGComponentTransferFunctionElement*/ = 'SVGComponentTransferFunctionElement|SVGFEFuncAElement|SVGFEFuncBElement|SVGFEFuncGElement|SVGFEFuncRElement';
  var v4/*SVGGradientElement*/ = 'SVGGradientElement|SVGLinearGradientElement|SVGRadialGradientElement';
  var v5/*SVGTextContentElement*/ = [v1/*SVGTextPositioningElement*/,'SVGTextContentElement|SVGTextPathElement'].join('|');
  var v6/*HTMLHtmlElement*/ = 'HTMLHtmlElement|SVGDocument';
  var v7/*HTMLMediaElement*/ = 'HTMLMediaElement|HTMLAudioElement|HTMLVideoElement';
  var v8/*SVGElement*/ = [v2/*SVGAnimationElement*/,v3/*SVGComponentTransferFunctionElement*/,v4/*SVGGradientElement*/,v5/*SVGTextContentElement*/,'SVGElement|SVGAElement|SVGAltGlyphDefElement|SVGAltGlyphItemElement|SVGCircleElement|SVGClipPathElement|SVGCursorElement|SVGDefsElement|SVGDescElement|SVGEllipseElement|SVGFEBlendElement|SVGFEColorMatrixElement|SVGFEComponentTransferElement|SVGFECompositeElement|SVGFEConvolveMatrixElement|SVGFEDiffuseLightingElement|SVGFEDisplacementMapElement|SVGFEDistantLightElement|SVGFEDropShadowElement|SVGFEFloodElement|SVGFEGaussianBlurElement|SVGFEImageElement|SVGFEMergeElement|SVGFEMergeNodeElement|SVGFEMorphologyElement|SVGFEOffsetElement|SVGFEPointLightElement|SVGFESpecularLightingElement|SVGFESpotLightElement|SVGFETileElement|SVGFETurbulenceElement|SVGFilterElement|SVGFontElement|SVGFontFaceElement|SVGFontFaceFormatElement|SVGFontFaceNameElement|SVGFontFaceSrcElement|SVGFontFaceUriElement|SVGForeignObjectElement|SVGGElement|SVGGlyphElement|SVGGlyphRefElement|SVGHKernElement|SVGImageElement|SVGLineElement|SVGMPathElement|SVGMarkerElement|SVGMaskElement|SVGMetadataElement|SVGMissingGlyphElement|SVGPathElement|SVGPatternElement|SVGPolygonElement|SVGPolylineElement|SVGRectElement|SVGSVGElement|SVGScriptElement|SVGStopElement|SVGStyleElement|SVGSwitchElement|SVGSymbolElement|SVGTitleElement|SVGUseElement|SVGVKernElement|SVGViewElement'].join('|');
  var v9/*CharacterData*/ = [v0/*Text*/,'CharacterData|Comment'].join('|');
  var v10/*DocumentFragment*/ = 'DocumentFragment|ShadowRoot';
  var v11/*Element*/ = [v6/*HTMLHtmlElement*/,v7/*HTMLMediaElement*/,v8/*SVGElement*/,'Element|HTMLElement|HTMLAnchorElement|HTMLAppletElement|HTMLAreaElement|HTMLBRElement|HTMLBaseElement|HTMLBaseFontElement|HTMLBodyElement|HTMLButtonElement|HTMLCanvasElement|HTMLContentElement|HTMLDListElement|HTMLDetailsElement|HTMLDirectoryElement|HTMLDivElement|HTMLEmbedElement|HTMLFieldSetElement|HTMLFontElement|HTMLFormElement|HTMLFrameElement|HTMLFrameSetElement|HTMLHRElement|HTMLHeadElement|HTMLHeadingElement|IntentionallyInvalid|HTMLIFrameElement|HTMLImageElement|HTMLInputElement|HTMLKeygenElement|HTMLLIElement|HTMLLabelElement|HTMLLegendElement|HTMLLinkElement|HTMLMapElement|HTMLMarqueeElement|HTMLMenuElement|HTMLMetaElement|HTMLMeterElement|HTMLModElement|HTMLOListElement|HTMLObjectElement|HTMLOptGroupElement|HTMLOptionElement|HTMLOutputElement|HTMLParagraphElement|HTMLParamElement|HTMLPreElement|HTMLProgressElement|HTMLQuoteElement|HTMLScriptElement|HTMLSelectElement|HTMLShadowElement|HTMLSourceElement|HTMLSpanElement|HTMLStyleElement|HTMLTableCaptionElement|HTMLTableCellElement|HTMLTableColElement|HTMLTableElement|HTMLTableRowElement|HTMLTableSectionElement|HTMLTextAreaElement|HTMLTitleElement|HTMLTrackElement|HTMLUListElement|HTMLUnknownElement'].join('|');
  var v12/*AbstractWorker*/ = 'AbstractWorker|SharedWorker|Worker';
  var v13/*Node*/ = [v9/*CharacterData*/,v10/*DocumentFragment*/,v11/*Element*/,'Node|Attr|HTMLDocument|DocumentType|Entity|EntityReference|Notation|ProcessingInstruction'].join('|');
  var table = [
    // [dynamic-dispatch-tag, tags of classes implementing dynamic-dispatch-tag]
    ['AbstractWorker', v12/*AbstractWorker*/]
    , ['Text', v0/*Text*/]
    , ['CharacterData', v9/*CharacterData*/]
    , ['DOMTokenList', 'DOMTokenList|DOMSettableTokenList']
    , ['HTMLHtmlElement', v6/*HTMLHtmlElement*/]
    , ['DocumentFragment', v10/*DocumentFragment*/]
    , ['HTMLMediaElement', v7/*HTMLMediaElement*/]
    , ['SVGAnimationElement', v2/*SVGAnimationElement*/]
    , ['SVGComponentTransferFunctionElement', v3/*SVGComponentTransferFunctionElement*/]
    , ['SVGGradientElement', v4/*SVGGradientElement*/]
    , ['SVGTextPositioningElement', v1/*SVGTextPositioningElement*/]
    , ['SVGTextContentElement', v5/*SVGTextContentElement*/]
    , ['SVGElement', v8/*SVGElement*/]
    , ['Element', v11/*Element*/]
    , ['EntrySync', 'EntrySync|DirectoryEntrySync|FileEntrySync']
    , ['Node', v13/*Node*/]
    , ['EventTarget', [v12/*AbstractWorker*/,v13/*Node*/,'EventTarget|DOMApplicationCache|EventSource|MessagePort|Notification|SVGElementInstance|WebSocket|DOMWindow|XMLHttpRequest|XMLHttpRequestUpload'].join('|')]
    , ['HTMLCollection', 'HTMLCollection|HTMLOptionsCollection']
    , ['StyleSheet', 'StyleSheet|CSSStyleSheet']
    , ['Uint8Array', 'Uint8Array|Uint8ClampedArray']
  ];
  $dynamicSetMetadata(table);
})();
//  ********** Globals **************
function $static_init(){
  $globals._firstMeasurementRequest = true;
  $globals._nextMeasurementFrameScheduled = false;
  $globals.Random_x = (0);
}
var const$0000 = Object.create(_DeletedKeySentinel.prototype, {});
var const$0001 = Object.create(NoMoreElementsException.prototype, {});
var const$0002 = Object.create(EmptyQueueException.prototype, {});
var const$0003 = Object.create(UnsupportedOperationException.prototype, {_message: {"value": "", writeable: false}});
var const$0006 = Object.create(_SimpleClientRect.prototype, {left: {"value": (0), writeable: false}, top: {"value": (0), writeable: false}, width: {"value": (0), writeable: false}, height: {"value": (0), writeable: false}});
var const$0007 = Object.create(IllegalAccessException.prototype, {});
var const$0008 = ImmutableList.ImmutableList$from$factory([]);
var const$0009 = Object.create(EmptyElementRect.prototype, {client: {"value": const$0006, writeable: false}, offset: {"value": const$0006, writeable: false}, scroll: {"value": const$0006, writeable: false}, bounding: {"value": const$0006, writeable: false}, clientRects: {"value": const$0008, writeable: false}});
var const$0011 = Object.create(NotImplementedException.prototype, {});
var $globals = {};
$static_init();
main();
