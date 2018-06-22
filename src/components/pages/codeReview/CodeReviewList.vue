<template>
  <div class="be-content">
    <div class="main-content container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading panel-heading-divider">人员筛选</div>
        <div class="panel-body flexBox">
          <div class="boxFlex_1">
            <select class="form-control input-sm" v-model="selectedPersonId" @change="handleSelectedPersonChange">
              <option v-for="person of persons" :key="person.userId" :value="person.userId">{{ person.name }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="panel panel-default m-b-0">
        <div v-if="reviews.length > 0" class="panel-body p-b-0">
          <div v-for="review of reviews" :key="review.id" class="code-review-brief">
            <p class="flexBox boxPackJustify" @click="reviewClicked(review)">
              <span class="heading boxFlex_1">{{ review.userLabel }}</span>
              <span class="boxFlex_0 date">
                {{ review.codeReviewTime }}<i class="mdi mdi-chevron-right detail"></i>
              </span>
            </p>
          </div>
        </div>
        <div v-else class="text-center noneReviewRemind">
          你还没有 Code Review，赶快新建一个吧
        </div>
        <div class="btn-fixed center">
          <button class="btn btn-space btn-primary btn-add" @click="addNewCodeReview">创建</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Global from '@/components/Global'
import { mapState } from 'vuex'
export default {
  name: 'CodeReviewList',
  data: function () {
    return {
      persons: [],
      selectedPersonId: '',
      reviews: []
    }
  },
  created () {
    this.codeReviewInit()
    this.handleSelectedPersonChange()
  },
  activated () {
    this.codeReviewInit()
  },
  computed: {
    ...mapState({
      personMsg: 'user',
      codeReviewPerson: 'codeReviewPerson'
    }),
    selectedPerson: function () {
      if (!this.selectedPersonId) {
        return null
      }
      for (var index in this.persons) {
        if (this.persons[index].userId === Number(this.selectedPersonId)) {
          return this.persons[index]
        }
      }
      return null
    }
  },
  methods: {
    async codeReviewInit () {
      await this.getPersons()
      this.selectedPersonId = this.codeReviewPerson && this.codeReviewPerson.hasOwnProperty('userId') ? this.codeReviewPerson.userId : null
      if (!this.selectedPersonId) {
        this.selectedPersonId = this.personMsg.id
      }
      this.getReviewsBySelectedPerson()
      this.$store.commit('setCodeReviewPerson', this.selectedPerson)
    },
    async getPersons () {
      let result = await this.$api(Global.url.apiPersons, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.persons = result.data.data
      }
    },
    async getReviewsBySelectedPerson () {
      if (this.selectedPersonId) {
        let result = await this.$api(Global.url.apiCodeReview + '/' + this.selectedPersonId, '', 'GET')
        if (result.data && result.data.code === 200) {
          this.reviews = result.data.data
        }
      }
    },
    handleSelectedPersonChange () {
      this.$store.commit('setCodeReviewPerson', this.selectedPerson)
      this.getReviewsBySelectedPerson()
    },
    reviewClicked (review) {
      if (!review.id) {
        return
      }
      this.$store.commit('setCodeReview', review)
      this.$router.push({
        name: 'CodeReviewDetail',
        params: {
          'id': review.id
        }
      })
    },
    addNewCodeReview () {
      if (!this.selectedPerson) {
        return
      }
      this.$router.push({
        name: 'CodeReviewForm'
      })
    }
  }
}
</script>

<style scoped>
.code-review-brief {
  padding: 15px 5px 8px;
  border-bottom: 1px solid #d9d9d9;
  vertical-align: middle;
}
.code-review-brief:last-child{
  border-bottom: none;
}
.code-review-brief > p {
  color: #333333;
  cursor: pointer;
  margin: 0;
}
.code-review-brief > p span{
  display: block;
}
.code-review-brief .heading {
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.code-review-brief .date {
  font-size: 14px;
}
.code-review-brief .detail {
  margin: 3px 0px 0px 5px;
}
.noneReviewRemind {
  color: #d9d9d9;
  padding: 20px;
}
.p-b-0{
  padding-bottom: 0;
}
.m-b-0{
  margin-bottom: 0;
}
</style>
