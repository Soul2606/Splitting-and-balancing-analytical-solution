





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
        }
        return false
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
        //Anything lower than this expected value does not need to be modified, bet everything else need to be subtracted equally. 
        const sum = new Fraction()
        const names = []
        for (const targeted_by of this.targeted_by) {
            if (targeted_by instanceof Linked_list_balancer_part) {
                const outgoing_lane = targeted_by.outgoing_lanes_data
                sum.add(outgoing_lane.value)
                names.push(outgoing_lane.name)
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
            let stop = false
            while (!stop) {                
                const max_expected_value_per_input = new Fraction(output_lanes, this.targeted_by.length)
                const difference_remaining_per_lane = new Fraction(difference_remaining)
                difference_remaining_per_lane.divide(this.targeted_by.length)
                let balancer_parts_outside_max = []
                let lowest_value_outside_max = new Fraction(Infinity, 1)
                for (const targeted_by of this.targeted_by) {
                    if (targeted_by instanceof Linked_list_balancer_part) {
                        if (targeted_by.outgoing_lanes_data.value.greater(difference_remaining_per_lane)) {
                            balancer_parts_outside_max.push(targeted_by)
                            if (lowest_value_outside_max.greater(targeted_by.outgoing_lanes_data.value)) {
                                lowest_value_outside_max = new Fraction(targeted_by.outgoing_lanes_data.value)
                            }
                        }
                    }
                }
                
                console.log('max_expected_value_per_input', max_expected_value_per_input)
                console.log('balancer_parts_outside_max', balancer_parts_outside_max)
                console.log('difference_remaining_per_lane', difference_remaining_per_lane)
                console.log('lowest_value_outside_max', lowest_value_outside_max)

                if (balancer_parts_outside_max.length === 0) {
                    break
                }

                const difference_remaining_per_lanes_outside_max = new Fraction(difference_remaining)
                difference_remaining_per_lanes_outside_max.divide(balancer_parts_outside_max.length)
    
                if (lowest_value_outside_max.greater(difference_remaining_per_lanes_outside_max)) {
                    console.log('condition passed')
                    for (const balancer_part of balancer_parts_outside_max) {
                        balancer_part.outgoing_lanes_data.value.subtract(lowest_value_outside_max)
                        balancer_part.outgoing_lanes_data.maximum_value = balancer_part.outgoing_lanes_data.value
                        difference_remaining.subtract(lowest_value_outside_max)
                    }
                }else{
                    console.log('condition failed')
                    for (const balancer_part of balancer_parts_outside_max) {
                        balancer_part.outgoing_lanes_data.maximum_value = new Fraction(difference_remaining).divide(balancer_parts_outside_max.length.length)
                        balancer_part.outgoing_lanes_data.value = new Fraction(difference_remaining).divide(balancer_parts_outside_max.length.length)
                    }
                    stop = true
                }
            }
        }
        this.outgoing_lanes_data.value = sum
        this.outgoing_lanes_data.name = String(names)
    }



}






const balancer_part1 = new Linked_list_balancer_part('A', '1/1');
const balancer_part2 = new Linked_list_balancer_part('B', '1/1');
const balancer_part3 = new Linked_list_balancer_part('C');

balancer_part1.add_target(balancer_part3)
balancer_part2.add_target(balancer_part3)

balancer_part3.calculate()
console.log(balancer_part3)
