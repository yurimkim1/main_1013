import { Vector3 } from '../../math/Vector3.js';
import { Curve } from '../core/Curve.js';

/**
 * @author zz85 https://github.com/zz85
 *
 * Centripetal CatmullRom Curve - which is useful for avoiding
 * cusps and self-intersections in non-uniform catmull rom curves.
 * http://www.cemyuksel.com/research/catmullrom_param/catmullrom.pdf
 *
 * curve.type accepts centripetal(default), chordal and catmullrom
 * curve.tension is used for catmullrom which defaults to 0.5
 */

var CatmullRomCurve3 = ( function() {

	var
		tmp = new Vector3(),
		px = new CubicPoly(),
		py = new CubicPoly(),
		pz = new CubicPoly();

	/*
	Based on an optimized c++ solution in
	 - http://stackoverflow.com/questions/9489736/catmull-rom-curve-with-no-cusps-and-no-self-intersections/
	 - http://ideone.com/NoEbVM

	This CubicPoly class could be used for reusing some variables and calculations,
	but for three.js curve use, it could be possible inlined and flatten into a single function call
	which can be placed in CurveUtils.
	*/

	function CubicPoly() {}

	/*
	 * Compute coefficients for a cubic polynomial
	 *   p(s) = c0 + c1*s + c2*s^2 + c3*s^3
	 * such that
	 *   p(0) = x0, p(1) = x1
	 *  and
	 *   p'(0) = t0, p'(1) = t1.
	 */
	CubicPoly.prototype.init = function( x0, x1, t0, t1 ) {

		this.c0 = x0;
		this.c1 = t0;
		this.c2 = - 3 * x0 + 3 * x1 - 2 * t0 - t1;
		this.c3 = 2 * x0 - 2 * x1 + t0 + t1;

	};

	CubicPoly.prototype.initNonuniformCatmullRom = function( x0, x1, x2, x3, dt0, dt1, dt2 ) {

		// compute tangents when parameterized in [t1,t2]
		var t1 = ( x1 - x0 ) / dt0 - ( x2 - x0 ) / ( dt0 + dt1 ) + ( x2 - x1 ) / dt1;
		var t2 = ( x2 - x1 ) / dt1 - ( x3 - x1 ) / ( dt1 + dt2 ) + ( x3 - x2 ) / dt2;

		// rescale tangents for parametrization in [0,1]
		t1 *= dt1;
		t2 *= dt1;

		// initCubicPoly
		this.init( x1, x2, t1, t2 );

	};

	// standard Catmull-Rom spline: interpolate between x1 and x2 with previous/following points x1/x4
	CubicPoly.prototype.initCatmullRom = function( x0, x1, x2, x3, tension ) {

		this.init( x1, x2, tension * ( x2 - x0 ), tension * ( x3 - x1 ) );

	};

	CubicPoly.prototype.calc = function( t ) {

		var t2 = t * t;
		var t3 = t2 * t;
		return this.c0 + this.c1 * t + this.c2 * t2 + this.c3 * t3;

	};

	// Subclass Three.js curve
	return Curve.create(

		function ( p /* array of Vector3 */ ) {

			this.points = p || [];
			this.closed = false;

		},

		function ( t ) {

			var points = this.points,
				point, intPoint, weight, l;

			l = points.length;

			if ( l < 2 ) console.log( 'duh, you need at least 2 points' );

			point = ( l - ( this.closed ? 0 : 1 ) ) * t;
			intPoint = Math.floor( point );
			weight = point - intPoint;

			if ( this.closed ) {

				intPoint += intPoint > 0 ? 0 : ( Math.floor( Math.abs( intPoint ) / points.length ) + 1 ) * points.length;

			} else if ( weight === 0 && intPoint === l - 1 ) {

				intPoint = l - 2;
				weight = 1;

			}

			var p0, p1, p2, p3; // 4 points

			if ( this.closed || intPoint > 0 ) {

				p0 = points[ ( intPoint - 1 ) % l ];

			} else {

				// extrapolate first point
				tmp.subVectors( points[ 0 ], points[ 1 ] ).add( points[ 0 ] );
				p0 = tmp;

			}

			p1 = points[ intPoint % l ];
			p2 = points[ ( intPoint + 1 ) % l ];

			if ( this.closed || intPoint + 2 < l ) {

				p3 = points[ ( intPoint + 2 ) % l ];

			} else {

				// extrapolate last point
				tmp.subVectors( points[ l - 1 ], points[ l - 2 ] ).add( points[ l - 1 ] );
				p3 = tmp;

			}

			if ( this.type === undefined || this.type === 'centripetal' || this.type === 'chordal' ) {

				// init Centripetal / Chordal Catmull-Rom
				var pow = this.type === 'chordal' ? 0.5 : 0.25;
				var dt0 = Math.pow( p0.distanceToSquared( p1 ), pow );
				var dt1 = Math.pow( p1.distanceToSquared( p2 ), pow );
				var dt2 = Math.pow( p2.distanceToSquared( p3 ), pow );

				// safety check for repeated points
				if ( dt1 < 1e-4 ) dt1 = 1.0;
				if ( dt0 < 1e-4 ) dt0 = dt1;
				if ( dt2 < 1e-4 ) dt2 = dt1;

				px.initNonuniformCatmullRom( p0.x, p1.x, p2.x, p3.x, dt0, dt1, dt2 );
				py.initNonuniformCatmullRom( p0.y, p1.y, p2.y, p3.y, dt0, dt1, dt2 );
				pz.initNonuniformCatmullRom( p0.z, p1.z, p2.z, p3.z, dt0, dt1, dt2 );

			} else if ( this.type === 'catmullrom' ) {

				var tension = this.tension !== undefined ? this.tension : 0.5;
				px.initCatmullRom( p0.x, p1.x, p2.x, p3.x, tension );
				py.initCatmullRom( p0.y, p1.y, p2.y, p3.y, tension );
				pz.initCatmullRom( p0.z, p1.z, p2.z, p3.z, tension );

			}

			var v = new Vector3(
				px.calc( weight ),
				py.calc( weight ),
				pz.calc( weight )
			);

			return v;

		}

	);

} )();


export { CatmullRomCurve3 };
