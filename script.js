





class Fraction {
    constructor(numerator = 0, denominator = 1) {
        if (typeof numerator === 'string') {
            const split_string = numerator.split('/')
            this.numerator = Number(split_string[0])
            this.denominator = Number(split_string[1])
        }else if (numerator instanceof Fraction) {
            this.numerator = numerator.numerator
            this.denominator = numerator.denominator
        }else{
            this.numerator = numerator
            this.denominator = denominator
        }
    }

    clone(){
        return new Fraction(this.numerator, this.denominator);
    }

    value(){
        return this.numerator / this.denominator
    }

    // Greatest common divisor
    gcd(a, b) {
        return b ? this.gcd(b, a % b) : Math.abs(a);
    }

    // Reduces the fraction to its simplest from
    reduce(){
        const gcd = this.gcd(this.numerator, this.denominator)
        this.numerator /= gcd
        this.denominator /= gcd
        return this
    }

    add(value){
        if (value instanceof Fraction) {
            this.numerator = (this.numerator * value.denominator) + (value.numerator * this.denominator)
            this.denominator = this.denominator * value.denominator
        }else if (typeof value === 'number') {
            this.numerator += value * this.denominator
        }
        return this
    }

    subtract(value){
        if (value instanceof Fraction) {
            this.numerator = (this.numerator * value.denominator) - (value.numerator * this.denominator)
            this.denominator = this.denominator * value.denominator
        }else if (typeof value === 'number') {
            this.numerator -= value * this.denominator
        }
        return this
    }
    
    multiply(value){
        if (value instanceof Fraction) {
            this.numerator *= value.numerator
            this.denominator *=value.denominator
        }else if (typeof value === 'number') {
            this.numerator *= value
        }
        return this
    }

    divide(value){
        if (value instanceof Fraction) {
            this.numerator *= value.denominator
            this.denominator *=value.numerator
        }else if (typeof value === 'number') {
            this.denominator *= value
        }
        return this
    }

    toString(){
        return `${this.numerator}/${this.denominator}`
    }

    // Farey addition, also known as naive addition
    farey(value){
        if (value instanceof Fraction) {
            this.numerator += value.numerator
            this.denominator += value.denominator
        }else if (typeof value === 'number') {
            this.numerator += value
            this.denominator += 1
        }
        return this
    }

    greater(value){
        if (value instanceof Fraction) {
            return this.numerator * value.denominator > this.denominator * value.numerator
        }else if (typeof value === 'number'){
            return this.numerator > this.denominator * value
        }
        return false
    }
    
    less(value){
        if (value instanceof Fraction) {
            return this.numerator * value.denominator < this.denominator * value.numerator
        }else if (typeof value === 'number'){
            return this.numerator < this.denominator * value
        }
        return false
    }

    max(value){
        if (value.greater(this)) {
            return value
        }else{
            return this
        }
    }
    
    min(value){        
        if (value.less(this)) {
            return value
        }else{
            return this
        }
    }

}




class Balancer_part_flow_value{
	constructor(name = '', value = new Fraction()) {
        this.name = name
        this.value = value
        this.maximum_value = new Fraction(1,1)
	}   
}




const all_balancer_parts = []
const balancer_part_targeted_by_limit = 2

class Linked_list_balancer_part{
	constructor(outgoing_lane_name, outgoing_lane_value = '0/1', name = ''){
		//Name for debugging
		this.name = name
		this.transfer_targets = []
		this.targeted_by = []
        this.outgoing_lanes_data = new Balancer_part_flow_value(outgoing_lane_name, new Fraction(outgoing_lane_value))
		all_balancer_parts.push(this)
	}

	erase(){
		// This removes any instance of this from all_balancer_parts.
		console.log('erasing balancer_part', this)
		const index_of_this = all_balancer_parts.indexOf(this)
		if (index_of_this === -1) {
			console.warn('could not find this balancer_part in all balancer_parts', this)
		}else{
			all_balancer_parts.splice(index_of_this, 1)
		}
        for (const target of this.transfer_targets) {
            if (target instanceof Linked_list_balancer_part) {
                const index_of_this_in_targets_targeted_by = target.targeted_by.indexOf(this)
                if (index_of_this_in_targets_targeted_by === -1) {
                    console.warn('target did not have this in targeted by')
                }else{
                    target.targeted_by.splice(index_of_this_in_targets_targeted_by, 1)
                }
            }
        }
        for (const targeted_by of this.targeted_by) {
            if (targeted_by instanceof Linked_list_balancer_part) {
                const index_of_this_in_targeted_bys_transfer_targets = targeted_by.transfer_targets.indexOf(this)
                if (index_of_this_in_targeted_bys_transfer_targets === -1) {
                    console.warn('targeted_by did not have this in transfer_targets')
                }else{
                    targeted_by.transfer_targets.splice(index_of_this_in_targeted_bys_transfer_targets, 1)
                }
            }
        }
		// This object should now be in limbo and be removed by the garbage collector if no other instances of this object is in memory
	}

	add_target(new_transfer_target){
		if (!(new_transfer_target instanceof Linked_list_balancer_part) && new_transfer_target !== null) {
			throw new Error("Invalid parameter", new_transfer_target)
		}
		if (this.transfer_targets.includes(new_transfer_target)){
			return true
		}
		if (new_transfer_target === null || new_transfer_target === undefined) {
			return false
		}
		if (new_transfer_target.targeted_by.length >= balancer_part_targeted_by_limit) {
			throw new Error("New transfer target is targeted by too many balancer_part")
		}
		new_transfer_target.targeted_by.push(this)
		this.transfer_targets.push(new_transfer_target)
		return true
	}

    remove_target(target_to_remove){
        if (typeof target_to_remove !== 'number' || !(target_to_remove instanceof Linked_list_balancer_part)) {
            throw new Error("Invalid parameters");
            
        }
        let index_of_target_to_remove
        if (typeof target_to_remove === 'number') {
            if (target_to_remove >= this.transfer_targets.length) {
                throw new Error("Index out of range");
            }
            index_of_target_to_remove = target_to_remove
        }else{
            index_of_target_to_remove = this.transfer_targets.indexOf(target_to_remove)
            if (index_of_target_to_remove === -1) {
                throw new Error("Could not find target to remove");
            }
        }
        const index_of_this_in_target_to_removes_targeted_by = this.transfer_targets[index_of_target_to_remove].targeted_by.indexOf(this)
        if (index_of_this_in_target_to_removes_targeted_by === -1) {
            console.warn('target to remove did not contain this in targeted by')
        }else{
            this.transfer_targets[index_of_target_to_remove].targeted_by.splice(index_of_this_in_target_to_removes_targeted_by, 1)
        }
        this.transfer_targets.splice(index_of_target_to_remove, 1)
    }


    search(visited = new Set()) {
        if (visited.has(this)) {
            return {visited, results_set:new Set()}
        }

        visited.add(this)
        const results_set = new Set()
        results_set.add(this)

        // search forwards
        for (const target of this.transfer_targets) {
            const results = target.search(visited)
            results.visited.forEach(item => {visited.add(item)})
            results.results_set.forEach(item => {results_set.add(item)})
        }
        // search backwards
        for (const targeted_by of this.targeted_by) {
            const results = targeted_by.search(visited)
            results.visited.forEach(item => {visited.add(item)})
            results.results_set.forEach(item => {results_set.add(item)})
        }
        return {visited, results_set}
    }

    calculate(){
        //This function constrains the values of balancer parts targeting this balancer part based on a bunch of conditions
        //The value of incoming 'lanes' is summed and divided by the amount of outgoing lanes. But outgoing lanes may not be grater than 1
        //If it is than the incoming lanes need to be reduced based on what the maximum expected value of each lane is, which is output_lanes / input_lanes. 
        //Anything lower than this expected value does not need to be modified, but everything else need to be subtracted equally, but no so much that it would
        // overshoot the maximum expected value. 
        const sum = new Fraction()
        const names = []
        for (const targeted_by of this.targeted_by) {
            if (targeted_by instanceof Linked_list_balancer_part) {
                const outgoing_lane = targeted_by.outgoing_lanes_data
                sum.add(outgoing_lane.value)
                names.push(outgoing_lane.name)
            }else{
                throw new Error("Not targeted by an balancer part", this);
            }
        }

        const output_lanes = this.transfer_targets.length === 0?1:this.transfer_targets.length

        sum.divide(output_lanes)

        if (sum.numerator > sum.denominator) {
            let difference_remaining = new Fraction(sum.numerator - sum.denominator, sum.denominator)
            console.log('difference_remaining', difference_remaining)
            // The fraction needed to be multiplied with the sum for it to be equal to 1
            const multiply_to_1_fraction = new Fraction(sum.denominator, sum.numerator)
            sum.multiply(multiply_to_1_fraction)
            
            const max_expected_value_per_input = new Fraction(output_lanes, this.targeted_by.length)
            let balancer_parts_outside_max = []
            for (const targeted_by of this.targeted_by) {
                if (targeted_by instanceof Linked_list_balancer_part) {
                    if (targeted_by.outgoing_lanes_data.value.greater(max_expected_value_per_input)) {
                        balancer_parts_outside_max.push(targeted_by)
                    }
                }else{
                    throw new Error("Not targeted by an balancer part", this);
                }
            }
            
            console.log('max_expected_value_per_input', max_expected_value_per_input)
            console.log('balancer_parts_outside_max', balancer_parts_outside_max)

            const values_to_be_reduced_by = distribute_fraction_within_range(difference_remaining, balancer_parts_outside_max.map(part=>part.outgoing_lanes_data.value.clone().subtract(max_expected_value_per_input)))

            balancer_parts_outside_max.forEach((element, index)=>{
                element.outgoing_lanes_data.value.subtract(values_to_be_reduced_by[index])
            })
            
            for (const balancer_part of this.targeted_by) {
                if (balancer_part instanceof Linked_list_balancer_part) {
                    balancer_part.outgoing_lanes_data.maximum_value = balancer_part.outgoing_lanes_data.value.max(max_expected_value_per_input)
                }else{
                    throw new Error("Not targeted by an balancer part", this);
                }
            }
        }
        this.outgoing_lanes_data.value = sum
        this.outgoing_lanes_data.name = String(names)
    }

}






const balancer_part1 = new Linked_list_balancer_part('A', '1/1');
const balancer_part2 = new Linked_list_balancer_part('B', '1/2');
const balancer_part_out = new Linked_list_balancer_part('OUT');

balancer_part1.add_target(balancer_part_out)
balancer_part2.add_target(balancer_part_out)

balancer_part_out.calculate()
console.log(balancer_part_out)







function distribute_number_within_range(number, array) {
    // Create an array of objects with value and original index
    let index_array = array.map((value, index)=>({value, index}))
    
    // Sort the result array in ascending order
    index_array.sort((a, b) => a - b);

    // Create a copy of the array to avoid mutating the original array
    let result = new Array(array.length).fill(0);
  
    // Iterate over each element and divide the number equally
    for (let i = 0; i < result.length; i++) {
        let share = Math.min(number / (index_array.length - i), index_array[i].value);
        result[index_array[i].index] = share;
        number -= share;
    
        if (number <= 0) break;
    }
    
    return result;
}



//This function mutates the values in array and i dont know why
function distribute_fraction_within_range(number, array) {
    const fraction = new Fraction(number)
    // Create an array of objects with value converted to fraction and original index
    let index_array = array.map((value, index)=>({value:new Fraction(value), index}))

    // Sort the result array in ascending order
    index_array.sort((a, b) => a.value.value() - b.value.value());

    // Create a copy of the array to avoid mutating the original array
    let result = new Array(array.length).fill(0);
  
    // Iterate over each element and divide the fraction equally
    for (let i = 0; i < result.length; i++) {
        const fraction_clone = fraction.clone()
        let share = fraction_clone.divide(index_array.length - i).min(index_array[i].value)
        result[index_array[i].index] = share;
        fraction.subtract(share);
    
        if (fraction <= 0) break;
    }
    
    return result;
}




