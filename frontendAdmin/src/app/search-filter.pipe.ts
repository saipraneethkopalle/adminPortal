import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  
  transform(list: any[], filterText: string,): any {
    // console.log(list,"list is ")
    let name = ["nat" ,"marketName" , "runner_name" , "RunnerName", "name"]
    
    return list ? list.filter((item) =>{
      let entries = Object.entries(item); 
      this.swap(entries,0,1);
      this.swap(entries,2,3)
      item = Object.fromEntries(entries);
      // console.log("item is ",item[`${value}`]
      let value = this.matchKey(item,name)
      console.log("value is ",value)

    let m=value.search(new RegExp(filterText, 'i')) > -1
    console.log('m is',m)
  }) : [];
    
    
    }

  matchKey(item:any,name:any){
    // console.log("item",item,"name",name)
    return Object.keys(item).every((key:any) =>{return key})?item.name:''
  }
  swap = (arr:any, i:any, j:any) => {
    // console.log("arris",arr[0])
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}
