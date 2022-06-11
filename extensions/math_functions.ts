
    export default {

        prime: (n: number) => {

            if (n < 2) return false;
            for (let i = 2; i < Math.sqrt(n); i++) 
                if (!(n % i)) return false;
            return true;
        },

        factors: (n: number) => {

            let factors = [];
            for (let i = 1; i <= n / 2; i++) 
                if (n % i === 0) factors.push(i);
            return factors;
        },

        gcd: (arr: number[]) => {
                
            let gcd = 1;
            for (let i = gcd + 1; i <= Math.min.apply(null, arr); i++) 
                if (arr.every(x => x % i === 0)) gcd = i;
            return gcd;
        }
    };