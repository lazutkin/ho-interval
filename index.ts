
function __unite( ints: HOInterval[ ] ): number[ ] {
  var result: number[ ] = [ ]

  for ( var idx1 = 0; idx1 < ints.length; ++idx1 ) {
    if ( result.indexOf( idx1 ) === -1 ) {
      var x = ints[ idx1 ]

      for ( var idx2 = idx1 + 1; idx2 < ints.length; ++idx2 ) {
        if ( result.indexOf( idx2 ) === -1 ) {
          var y = ints[ idx2 ]

          if ( x.isIntersect( y ) || x.isCloseTo( y ) ) {
            x.unite( y )
            result.push( idx2 )
          }
        }
      }
    }
  }
  return result
}

function sortNum(a: number, b: number){
  return a - b
}

class HOInterval {
  static length( int: HOInterval ): number {
    return int.b - int.a
  }

  static isValid( int: HOInterval ): boolean
  static isValid( a: number, b?: number ): boolean
  static isValid( a: any, b: number = a ): boolean {
    if ( a instanceof <any>HOInterval ) {
      a = a.a
      b = a.b
    }
    return a <= b
  }

  static unite( ints: HOInterval[ ] ): HOInterval[ ]
  static unite( ...input: any[ ] ): HOInterval[ ] {
    var ints: HOInterval[ ]

    if ( input.length === 1 ) {
      ints = input[ 0 ]
    } else {
      ints = input
    }

    // Holds indexes of united intervals
    var united

    while ( ( united = __unite( ints ) ) && united.length ) {
      united.sort(sortNum).reverse( )
      // Remove united intervals from input
      for ( var idx in united ) {
        ints.splice( united[ idx ], 1 )
      }
    }

    return ints
  }

  static gaps( ints: HOInterval[ ] ): HOInterval[ ]
  static gaps( ...input: any[ ] ): HOInterval[ ] {

    var ints: HOInterval[ ]

    if ( input.length === 1 ) {
      ints = input[ 0 ]
    } else {
      ints = input
    }

    if ( ints.length < 2 ) {
      return [ ]
    }

    var result = [ ]

    for ( var idx = 0; idx < ints.length - 1; ++idx ) {
      var aInt = ints[ idx ]
      var bInt = ints[ idx + 1 ]

      if ( aInt.isIntersect( bInt ) || aInt.isCloseTo( bInt ) ) {
        continue
      }

      var maxA = ( aInt.a > bInt.a ) ? aInt.a : bInt.a
      var minB = ( aInt.b < bInt.b ) ? aInt.b : bInt.b
      result.push( new HOInterval( minB, maxA ) )
    }

    return result
  }

  static intersect( a: HOInterval, b: HOInterval ): HOInterval {
    return ( new HOInterval( a ) ).intersect( b )
  }


  public a: number
  public b: number

  constructor( other: HOInterval )
  constructor( a: number, b: number )
  constructor( x: any, b: number = x ) {
    if ( x instanceof <any>HOInterval ) {
      this.a = x.a
      this.b = x.b
    } else {
      this.a = x
      this.b = b
    }
  }

  isCloseTo( other: HOInterval ): boolean {
    return ( this.b == other.a ) || ( this.a == other.b )
  }

  isEqualsTo( other: HOInterval ): boolean {
    return ( this.a == other.a ) && ( this.b == other.b )
  }

  isIntersect( other: HOInterval ): boolean
  isIntersect( x: number, y?: number ): boolean
  isIntersect( x: any, y: number = x ): boolean {
    if ( x instanceof <any>HOInterval ) {
      y = ( <HOInterval> x ).b
      x = ( <HOInterval> x ).a
    }

    var a = this.a
    var b = this.b

    if ( ( a < b ) && ( x < y) ) {
      return ( ( a <= x ) && ( x < b ) ) || ( ( x < a ) && ( a < y ) )

    } else if ( ( a < b ) && ( x == y ) ) {
      return ( a <= x ) && ( x < b )

    } else if ( ( a == b ) && ( x < b) ) {
      return ( x <= a ) && ( a < b )

    }  else if ( ( a == b ) && ( x == y) ) {
      return a == x
    }
  }

  unite( other: HOInterval ): HOInterval {
    if ( this.isIntersect( other ) || this.isCloseTo( other ) ) {
      var minA = ( this.a < other.a ) ? this.a : other.a
      var maxB = ( this.b > other.b ) ? this.b : other.b

      this.a = minA
      this.b = maxB
    }
    return this
  }

  intersect( other ): HOInterval {
    if ( this.isIntersect( other ) ) {
      var maxA = ( this.a > other.a ) ? this.a : other.a
      var minB = ( this.b < other.b ) ? this.b : other.b

      this.a = maxA
      this.b = minB
    }
    return this
  }

  add( val: number ): HOInterval {
    this.a += val
    this.b += val
    return this
  }
}

export = HOInterval
