





class Fraction {
    constructor(numerator = 0, denominator = 1) {
    this.numerator = numerator        
    this.denominator = denominator        
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
}




class Doubly_linked_balancer_part_flow_value{
	constructor(name = '', value = new Fraction()) {
        this.name = name
        this.value = value
	}

}




const all_balancer_parts = []
const balancer_part_targeted_by_limit = 2

class Doubly_linked_balancer_part{
	constructor(outgoing_lanes_data = [], name){
		//Name for debugging
		this.name = name === undefined? '': String(name)
		this.transfer_targets = []
		this.targeted_by = []
        this.incoming_lanes_data = []
        this.outgoing_lanes_data = outgoing_lanes_data
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
            if (target instanceof Doubly_linked_balancer_part) {
                const index_of_this_in_targets_targeted_by = target.targeted_by.indexOf(this)
                if (index_of_this_in_targets_targeted_by === -1) {
                    console.warn('target did not have this in targeted by')
                }else{
                    target.targeted_by.splice(index_of_this_in_targets_targeted_by, 1)
                }
            }
        }
        for (const targeted_by of this.targeted_by) {
            if (targeted_by instanceof Doubly_linked_balancer_part) {
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
		if (!(new_transfer_target instanceof Doubly_linked_balancer_part) && new_transfer_target !== null) {
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
        if (typeof target_to_remove !== 'number' || !(target_to_remove instanceof Doubly_linked_balancer_part)) {
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
}





