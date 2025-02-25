





class Fraction {
    constructor(numerator, denominator) {
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
}




class Doubly_linked_balancer_part_transfer_chain_info {
	constructor(termination, reference, success) {
		this.termination = termination
		if (termination === 'loop') {
			this.chain = []
		}else{
			this.chain = [{reference, success, variable_transferred:null}]
		}
	}

	add_to_chain(reference, success, variable_transferred){
		this.chain.unshift({reference,success,variable_transferred})
		return this.chain
	}

	is_latest_transfer_successful(){
		if (this.chain.length > 0) {
			return this.chain[0].success
		} else if (this.termination === 'loop') {
			return true
		}{
			console.warn('empty chain without hitting a loop', this)
			return false
		}
	}

	get_reference_chain(){
		return this.chain.map(element=>element.reference)
	}

	get_transfer_chain(){
		return this.chain.map(element=>element.variable_transferred)
	}

	get_success_chain(){
		return this.chain.map(element=>element.success)
	}
}




const all_balancer_parts = []
const balancer_part_targeted_by_limit = 2

class Doubly_linked_balancer_part{
	constructor(value, name){
		//Name for debugging
		this.name = name === undefined? '': String(name)
		this.value = value? value: null
		this.transfer_targets = []
		this.targeted_by = []
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



const balancer_part1 = new Doubly_linked_balancer_part('A', '1')
const balancer_part2 = new Doubly_linked_balancer_part('B', '2')
const balancer_part3 = new Doubly_linked_balancer_part('C', '3')
const balancer_part4 = new Doubly_linked_balancer_part('D', '4')

balancer_part1.add_target(balancer_part2)
balancer_part1.add_target(balancer_part3)
balancer_part2.add_target(balancer_part1)
balancer_part3.add_target(balancer_part4)

console.log(balancer_part1.search())
