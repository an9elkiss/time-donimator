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
      <div class="panel panel-default">
        <div v-for="review of reviews" :key="review.id" class="panel-body">
          <div class="code-review-brief">
            <a class="cfix" @click="reviewClicked(review)">
              <span class="fLeft heading">{{ review.userLabel }}</span>
              <i class="mdi mdi-chevron-right fRight detail"></i>
              <span class="fRight date">{{ review.codeReviewTime }}</span>
            </a>
          </div>
        </div>
      </div>
      <div class="panel-body text-center">
        <button class="btn btn-space btn-primary btn-add" @click="addNewCodeReview">创建</button>
        <!--<a class="btn btn-primary" @click="addNewCodeReview">创建</a>-->
      </div>
      <!--<div class="center code-btn">-->
        <!--<button class="btn btn-space btn-primary btn-add">评分</button>-->
        <!--<button class="btn btn-space btn-primary btn-add">编辑</button>-->
        <!--<button class="btn btn-space btn-primary btn-add" @click="codeReviewDelete">删除</button>-->
        <!--<button class="btn btn-space btn-primary btn-add">提交</button>-->
        <!--<button class="btn btn-space btn-primary btn-add" @click="goBack">返回</button>-->
      <!--</div>-->
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
  mounted: async function () {
    await this.getPersons()
    this.selectedPersonId = this.personMsg.userId
    this.getReviewsBySelectedPerson()
    console.log('setCodeReviewPerson--', this.selectedPerson)
    this.$store.commit('setCodeReviewPerson', this.selectedPerson)
  },
  computed: {
    ...mapState({
      personMsg: 'person'
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
    async getPersons () {
      let result = await this.$api(Global.url.apiPersons, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.persons = result.data.data
      }
    },
    async getReviewsBySelectedPerson () {
      let result = await this.$api(Global.url.apiCodeReview + '/' + this.selectedPersonId, '', 'GET')
      if (result.data && result.data.code === 200) {
        this.reviews = result.data.data
      }
    },
    handleSelectedPersonChange () {
      console.log('setCodeReviewPerson--', this.selectedPerson)
      this.$store.commit('setCodeReviewPerson', this.selectedPerson)
      this.getReviewsBySelectedPerson()
    },
    reviewClicked (review) {
      if (!review.id) {
        return
      }
      console.log('setCodeReview--', review)
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
        name: 'CodeReviewForm',
        query: {
          id: this.selectedPerson.userId,
          name: encodeURI(this.selectedPerson.name)
        }
      })
    }
  }
}
</script>

<style scoped>
  .btn {
    border-radius: 5px;
    padding: 2px 20px;
  }
  .code-review-brief {
    padding: 10px;
    border-bottom: 1px solid #d9d9d9;
    vertical-align: middle;
  }
  .code-review-brief > a {
    color: #333333;
  }
  .code-review-brief .heading {
    font-size: 16px;
  }
  .code-review-brief .date {
    font-size: 14px;
  }
  .code-review-brief .detail {
    margin: 3px 0px 0px 5px;
  }
</style>
